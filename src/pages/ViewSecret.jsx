import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { databases, storage } from "../appwrite/config";
import { Query } from "appwrite";
import CryptoJS from "crypto-js";

function ViewSecret() {
  const { token } = useParams();
  const location = useLocation();
  const [secret, setSecret] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | revealed | expired | error
  const [timeLeft, setTimeLeft] = useState(null);

  const dbID = "699165e1000f47988d38";
  const collectionID = "messages";

  const searchParams = new URLSearchParams(location.search);
  const expirySeconds = searchParams.get("expiry"); // now in seconds
  const key = searchParams.get("key"); // encryption key from link

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const res = await databases.listDocuments(dbID, collectionID, [
          Query.equal("messageId", token),
        ]);

        if (!res.documents.length) {
          setStatus("error");
          return;
        }

        const doc = res.documents[0];
        setSecret(doc);
        setStatus("revealed");

        // Parse image fileId if exists
        let fileId = null;
        if (doc.content) {
          const parsed = JSON.parse(doc.content);
          if (parsed.image) {
            try {
              const url = new URL(parsed.image);
              const parts = url.pathname.split("/");
              const idx = parts.indexOf("files");
              if (idx !== -1) fileId = parts[idx + 1];
            } catch (err) {
              console.warn("Invalid image URL", err);
            }
          }
        }

        // Countdown duration
        const duration = expirySeconds ? parseInt(expirySeconds) * 1000 : 7000;
        setTimeLeft(duration);

        // Start countdown
        const countdown = setTimeout(async () => {
          setStatus("expired");

          // Delete document (if somehow still exists)
          if (doc.$id)
            await databases
              .deleteDocument(dbID, collectionID, doc.$id)
              .catch(console.warn);

          // Delete image file
          if (fileId)
            await storage
              .deleteFile("699164f0003b00cdf52e", fileId)
              .catch(console.warn);
        }, duration);

        // Optional: update timer every second for UI
        let remaining = duration;
        const interval = setInterval(() => {
          remaining -= 1000;
          setTimeLeft(remaining > 0 ? remaining : 0);
        }, 1000);

        return () => {
          clearTimeout(countdown);
          clearInterval(interval);
        };
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    fetchSecret();
  }, [token, expirySeconds]);

  // Countdown timer
  useEffect(() => {
    if (!expirySeconds || !secret) return;

    let remaining = parseInt(expirySeconds) * 1000;
    setTimeLeft(remaining);

    const interval = setInterval(() => {
      remaining -= 1000;
      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setStatus("expired");
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirySeconds, secret]);

  const formatTime = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    return seconds < 60
      ? `${seconds}s`
      : `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  if (status === "loading")
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-xl p-6 flex flex-col items-center shadow-lg animate-pulse">
          <div className="text-4xl mb-4 animate-spin text-indigo-500">⏳</div>
          <p className="text-zinc-400 font-semibold text-lg">
            Loading your secret...
          </p>
        </div>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="bg-red-900/70 backdrop-blur-md border border-red-700 rounded-xl p-6 flex flex-col items-center shadow-lg animate-fade-in">
          <div className="text-4xl mb-4 text-red-500">❌</div>
          <p className="text-red-300 font-semibold text-lg">
            Secret not found.
          </p>
        </div>
      </div>
    );

  if (status === "expired")
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="bg-yellow-900/70 backdrop-blur-md border border-yellow-700 rounded-xl p-6 flex flex-col items-center shadow-lg animate-fade-in">
          <div className="text-4xl mb-4 text-yellow-400">⚠️</div>
          <p className="text-yellow-200 font-semibold text-lg">
            This secret has expired.
          </p>
        </div>
      </div>
    );

  const parsedContent = secret.content ? JSON.parse(secret.content) : {};

  // 🔐 Decrypt
  let decryptedText = "";
  try {
    if (parsedContent.text && key) {
      const bytes = CryptoJS.AES.decrypt(parsedContent.text, key);
      decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    }
  } catch (err) {
    decryptedText = "Unable to decrypt message";
    console.error("Decryption error:", err);
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 py-10 relative"
      style={{
        background:
          "radial-gradient(circle at top left, #000000, #1a1a1a, #330000)", // black + dark red
      }}
    >
      {/* Subtle animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-black to-gray-900 opacity-20 animate-gradient-x"></div>

      <div className="relative z-10 w-full max-w-xl space-y-4">
        <div className="bg-black/70 backdrop-blur-md border border-red-600 shadow-xl rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center text-red-400 flex items-center justify-center gap-2">
            🔐 One-Time Message
          </h2>

          {decryptedText && (
            <p className="text-gray-200 text-base whitespace-pre-wrap p-3 rounded bg-black/50 shadow-inner max-h-60 overflow-auto border border-red-700">
              {decryptedText}
            </p>
          )}

          {parsedContent.image && (
            <img
              src={parsedContent.image}
              alt="secret"
              className="rounded-md shadow-lg border border-red-600 max-h-96 mx-auto"
            />
          )}

          {timeLeft !== null && (
            <div className="text-center text-sm text-red-300">
              ⏳ This message will expire in{" "}
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 20s ease infinite;
          }
        `}
      </style>
    </div>
  );
}

export default ViewSecret;
