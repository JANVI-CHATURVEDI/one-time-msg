import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { Query } from 'appwrite';

function ViewSecret() {
  const { token } = useParams(); // token from URL
  const location = useLocation();
  const [secret, setSecret] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | revealed | expired | error
  const [timeLeft, setTimeLeft] = useState(null); // countdown timer in ms

  const dbID = '699165e1000f47988d38';
  const collectionID = 'messages';

  // Read expiry from URL query param
  const searchParams = new URLSearchParams(location.search);
  const expiryMinutes = searchParams.get('expiry'); // in minutes, or null

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const res = await databases.listDocuments(dbID, collectionID, [
          Query.equal("messageId", token)
        ]);

        if (res.documents.length === 0) {
          setStatus('error'); // no secret found
          return;
        }

        const doc = res.documents[0];
        setSecret(doc);
        setStatus('revealed');

        // Delete immediately if no expiry (one-time secret)
        if (!expiryMinutes && doc.$id) {
          setTimeout(() => setStatus('expired'), 1000); // hide after 1 second
          databases.deleteDocument(dbID, collectionID, doc.$id).catch(console.warn);
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    fetchSecret();
  }, [token, expiryMinutes]);

  // Handle expiry timer if expiryMinutes exists
  useEffect(() => {
    if (!expiryMinutes || !secret) return;

    let remaining = parseInt(expiryMinutes) * 60000;
    setTimeLeft(remaining);

    const interval = setInterval(() => {
      remaining -= 1000;
      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setStatus('expired'); // hide secret
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryMinutes, secret]);

  const formatTime = (ms) => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (status === 'loading')
    return <div className="p-6 text-center text-gray-500">⏳ Loading your secret...</div>;
  if (status === 'error')
    return <div className="p-6 text-center text-red-500">❌ Secret not found.</div>;
  if (status === 'expired')
    return <div className="p-6 text-center text-yellow-500">⚠️ This secret has expired.</div>;

  // Parse JSON from content
  const parsedContent = secret.content ? JSON.parse(secret.content) : {};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-white px-4 py-10">
      <div className="bg-white/30 backdrop-blur-md border border-white/50 shadow-xl rounded-xl p-6 max-w-xl w-full animate-fade-in space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          🔐 One-Time Message
        </h2>

        {parsedContent.text && (
          <p className="text-base text-gray-800 whitespace-pre-wrap p-3 rounded bg-white/80 shadow-inner max-h-60 overflow-auto border">
            {parsedContent.text}
          </p>
        )}

        {parsedContent.image && (
          <img
            src={parsedContent.image}
            alt="secret"
            className="rounded-md shadow-lg border max-h-96 mx-auto"
          />
        )}

        {timeLeft !== null && (
          <div className="text-center text-sm text-gray-600">
            ⏳ This message will expire in{' '}
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewSecret;

