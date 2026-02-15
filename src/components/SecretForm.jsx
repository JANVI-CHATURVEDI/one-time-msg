import React, { useState } from 'react';
import { databases, storage, ID } from '../appwrite/config';
import { nanoid } from 'nanoid'; // install this package
import { useNavigate } from 'react-router-dom';

function SecretForm() {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [expiry, setExpiry] = useState(''); // minutes
    const [loading, setLoading] = useState(false);
    const [link, setLink] = useState('');
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = nanoid();
            const expiryTime = expiry ? Date.now() + expiry * 60 * 1000 : null;   // Date.now() gives current time in milliseconds  and then we convert expiry time in minutes to milliseconds  , so expiryTime stores expiry time in milliseconds
            let imageUrl = null;

            // 1. If image is uploaded, upload it to Appwrite Storage
            if (image) {
                const file = await storage.createFile('687343ce0011224acaf8', ID.unique(), image);

                imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/687343ce0011224acaf8/files/${file.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;

            }

            // 2. Create document in Appwrite
            await databases.createDocument(
                '699165e1000f47988d38',
                'messages',
                ID.unique(),
                {
                    token,
                    text: text || null,
                    imageUrl,
                    isRead: false,
                    expiry: expiryTime, // appwrite stored expiry time in milliseconds
                }
            );

            setLink(`${window.location.origin}/view/${token}`);

            setText('');
            setImage(null);
            setExpiry('');
        } catch (err) {
            alert("Error saving secret: " + err.message);
        }

        setLoading(false);
    };


   

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-6 max-w-lg mx-auto rounded-xl shadow-xl bg-white/10 backdrop-blur-md border border-white/20 text-white"
        >
            <h2 className="text-xl font-bold">Share a One-Time Secret</h2>

            <textarea
                placeholder="Enter your msg..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border rounded p-2 text-black focus:outline-none focus:ring-0 focus:border-white/40"
            ></textarea>

            <div>
                <label className="block font-medium">OR Upload an Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="block mt-1 text-gray-300"
                />
            </div>

            <div>
                <label className="block font-medium">Set Expiry (in minutes)</label>
                <input
                    type="number"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="border rounded p-2 w-full text-black focus:outline-none focus:ring-0 focus:border-white/40"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Generating...' : 'Generate Link'}
            </button>

            {link && (    // if link is there
                <div className="mt-4 bg-white/20 p-3 rounded flex items-center justify-between text-white backdrop-blur">
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all underline"
                    >
                        {link}
                    </a>

                    <button
                        onClick={(e) => {
                            e.preventDefault(); // 🛑 prevent default anchor behavior
                            navigator.clipboard.writeText(link);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="ml-2 px-3 py-1 w-20 text-center bg-white/20 text-white rounded hover:bg-white/30 transition-all"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            )}


        </form>
    );
}

export default SecretForm;
