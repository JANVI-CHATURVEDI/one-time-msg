import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { Query } from 'appwrite';

function ViewSecret() {
  const { token } = useParams(); // get token from the URL
  const [secret, setSecret] = useState(null); // to store secret data
  const [status, setStatus] = useState('loading'); // loading | error | revealed | expired
  const [expiryTime, setExpiryTime] = useState(null); // expiry timestamp in milliseconds
  const [timeLeft, setTimeLeft] = useState(null); // countdown timer

  const dbID = '699165e1000f47988d38';
  const collectionID = 'messages';

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

        if (doc.expiry && Date.now() > new Date(doc.expiry).getTime()) {
          await databases.deleteDocument(dbID, collectionID, doc.$id);
          setStatus('expired');
          return;
        }

        setSecret(doc);
        setStatus('revealed');
        setExpiryTime(doc.expiry);
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    fetchSecret();
  }, [token]);

  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const remaining = new Date(expiryTime).getTime() - Date.now();

      if (remaining <= 0) {
        setTimeLeft(null);
        setStatus('expired');
        clearInterval(interval);
        if (secret?.$id) {
          databases.deleteDocument(dbID, collectionID, secret.$id).catch(console.warn);
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, secret]);

  const formatTime = (ms) => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (status === 'loading') return <div className="p-6 text-center text-gray-500">⏳ Loading your secret...</div>;
  if (status === 'error') return <div className="p-6 text-center text-red-500">❌ Secret not found.</div>;
  if (status === 'expired') return <div className="p-6 text-center text-yellow-500">⚠️ This secret has expired.</div>;

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

        {timeLeft && (
          <div className="text-center text-sm text-gray-600">
            ⏳ This message will expire in <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewSecret;
