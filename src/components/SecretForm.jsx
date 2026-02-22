import React, { useState } from 'react';
import { databases, storage, ID } from '../appwrite/config';
import { nanoid } from 'nanoid';
import CryptoJS from 'crypto-js';

function SecretForm() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [expiry, setExpiry] = useState(''); // minutes
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = nanoid();
      const expirySeconds = expiry ? parseInt(expiry) : 7;

      // Generate random key for encryption
      const encryptionKey = nanoid(32);

      // Encrypt text
      let encryptedText = null;
      if (text) {
        encryptedText = CryptoJS.AES.encrypt(text, encryptionKey).toString();
      }

      // Upload image if exists
      let uploadedImageUrl = null;
      if (image) {
        const file = await storage.createFile(
          '699164f0003b00cdf52e',
          ID.unique(),
          image
        );
        uploadedImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/699164f0003b00cdf52e/files/${file.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
      }

      // Store encrypted message
      const dataToStore = JSON.stringify({
        text: encryptedText,
        image: uploadedImageUrl || null,
      });

      await databases.createDocument(
        '699165e1000f47988d38',
        'messages',
        ID.unique(),
        {
          messageId: token,
          content: dataToStore,
          senderId: 'anonymous',
          receiverId: 'anyone',
          isRead: false,
          timestamp: new Date().toISOString(),
        }
      );

      // Build link
      let secretLink = `${window.location.origin}/view/${token}?key=${encryptionKey}`;
      if (uploadedImageUrl) secretLink += `&image=${encodeURIComponent(uploadedImageUrl)}`;
      if (expirySeconds) secretLink += `&expiry=${expirySeconds}`;

      setLink(secretLink);

      setText('');
      setImage(null);
      setExpiry('');
    } catch (err) {
      alert('Error saving secret: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 rounded-2xl shadow-2xl bg-black/40 backdrop-blur-xl border border-red-600/40 text-white"
    >
      <h2 className="text-2xl font-bold text-center text-red-400 drop-shadow-lg">
        🔐 Share a One-Time Secret
      </h2>

      <textarea
        placeholder="Enter your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 rounded-lg bg-black/60 border border-red-600/50 text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
        rows={4}
      />

      <div>
        <label className="block font-medium text-red-400 mb-1">OR Upload an Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full text-red-300 file:bg-red-700 file:text-white file:px-4 file:py-2 file:rounded hover:file:bg-red-600"
        />
      </div>

      <div>
        <label className="block font-medium text-red-400 mb-1">Set Expiry (seconds)</label>
        <input
          type="number"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full p-2 rounded-lg bg-black/60 border border-red-600/50 text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/50 text-white font-semibold transition-all disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Link'}
      </button>

      {link && (
        <div className="mt-4 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/50 border border-red-600/50 text-red-200 backdrop-blur-md">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline mb-2 sm:mb-0"
          >
            {link}
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1 w-full sm:w-auto text-center bg-red-700/40 hover:bg-red-700 rounded transition-all"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </form>
  );
}

export default SecretForm;