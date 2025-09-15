import React from "react";
import { ArrowRight, Shield, Timer, Image, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-gray-900 to-gray-950">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Share Secrets. Once Seen, Gone Forever.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
        >
          Send private messages or images securely with a single-use link.  
          Powered by <span className="font-semibold text-blue-400">Appwrite</span> for security and reliability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link
            to="/home"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-900/40 text-lg font-semibold transition-all"
          >
            Get Started <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900" id="how">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[ 
            { icon: <FileText size={40} />, title: "Write or Upload", desc: "Enter a message or upload an image." },
            { icon: <Timer size={40} />, title: "Set Expiry", desc: "Choose how long the secret exists." },
            { icon: <Shield size={40} />, title: "Generate & Share", desc: "Get a unique one-time link." },
            { icon: <Image size={40} />, title: "Auto-Destruct", desc: "Once opened, the secret disappears forever." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:shadow-blue-900/30 hover:scale-105 transition-transform"
            >
              <div className="text-blue-400 mb-4">{item.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-950">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: "📝", title: "Text + Image Sharing", desc: "Send private notes or images easily." },
            { icon: "⏱️", title: "Expiry Timer", desc: "Control how long your secret lives." },
            { icon: "🔐", title: "One-Time Access", desc: "Secret vanishes after one view." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:shadow-purple-900/30 hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-950 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} One-Time Msg | Built with ❤️ using Appwrite
        </p>
      </footer>
    </div>
  );
}
