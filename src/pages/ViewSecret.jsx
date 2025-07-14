import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { Query } from 'appwrite';

function ViewSecret() {
  const { token } = useParams(); // get token from the URL
  const [secret, setSecret] = useState(null); // to store secret data
  const [status, setStatus] = useState('loading'); // loading | error | revealed | expired
  const [expiryTime, setExpiryTime] = useState(null); // when secret will expire , stores expiry time in milliseconds
  const [timeLeft, setTimeLeft] = useState(null); // how much time is left (countdown)


  const dbID = '68733f8d002069e89292';
  const collectionID = '68733fa3003a9fd9cdef';

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const res = await databases.listDocuments(dbID, collectionID, [
          Query.equal("token", [token]) // it matches the token in appwrite  database
        ]);  // now res has all data stored in appwrite  which token matches the url token 

        if (res.documents.length === 0) {
          setStatus('error');    // there is no such message 
          return;
        }

        const doc = res.documents[0];  // we get the data stored in appwrite

        if (doc.expiry && Date.now() > new Date(doc.expiry).getTime()) {   // when time expires delete the msg
          await databases.deleteDocument(dbID, collectionID, doc.$id);
          setStatus('expired');
          return;
        }
         
        // we fetch the data stored in appwrite to show
        // till the time is not expired and data is not deleted
        setSecret(doc); // we put data in secret
        setStatus('revealed'); // reveal the secret
        setExpiryTime(doc.expiry); // set the expiry time from the expiry time stored in appwrite
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    fetchSecret();
  }, [token]);   //  fetchSecret() gets called again — to fetch the new message for the new token.

  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const remaining = expiryTime - Date.now();

      if (remaining <= 0) { // time is up
        setTimeLeft(null);
        setStatus('expired');
        clearInterval(interval); // stop the setInterval
        if (secret?.$id) {  // if secret is there , delete it
          databases.deleteDocument(dbID, collectionID, secret.$id).catch(console.warn);
        }
      } else {
        setTimeLeft(remaining); // if time is not up, set the remaining time
      }
    }, 1000);

    return () => clearInterval(interval);  // Before you rerun or destroy this effect, please clean up the previous timer.
  }, [expiryTime, secret]);

  const formatTime = (ms) => {              // convert milliseconds to minutes and seconds
    const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (status === 'loading') return <div className="p-6 text-center text-gray-500">⏳ Loading your secret...</div>;
  if (status === 'error') return <div className="p-6 text-center text-red-500">❌ Secret not found.</div>;
  if (status === 'expired') return <div className="p-6 text-center text-yellow-500">⚠️ This secret has expired.</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-whitepx-4 py-10">
      <div className="bg-white/30 backdrop-blur-md border border-white/50 shadow-xl rounded-xl p-6 max-w-xl w-full animate-fade-in space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          🔐 One-Time Message
        </h2>

        {secret.text && (
          <p className="text-base text-gray-800 whitespace-pre-wrap p-3 rounded bg-white/80 shadow-inner max-h-60 overflow-auto border">
            {secret.text}
          </p>
        )}

        {secret.imageUrl && (
          <img
            src={secret.imageUrl}
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
