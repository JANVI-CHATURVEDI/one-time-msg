import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Shield,
  Timer,
  Ghost,
  Image,
  FileText,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-red-500/30 overflow-x-hidden">
      {/* Premium Black + Red Background Grid */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000012_1px,transparent_1px),linear-gradient(to_bottom,#ff000012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/10 blur-[120px] rounded-full opacity-50" />
      </div>

      {/* Nav */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="bg-white p-1.5 rounded-lg group-hover:bg-red-500 transition-colors duration-300">
            <Lock size={18} className="text-black group-hover:text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            ONE-TIME <span className="text-red-500">MSG</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-red-500 transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-red-500 transition-colors">
            How It Works
          </a>
          <Link
            to="/home"
            className="px-6 py-2.5 rounded-full bg-red-500 text-black text-sm font-bold hover:bg-red-600 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
            AES-256 Military Grade Encryption
          </span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold tracking-tight mb-8 max-w-4xl"
          {...fadeInUp}
        >
          Send Secrets That{" "}
          <span className="text-red-500 italic">Self-Destruct</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl text-zinc-400 text-lg md:text-xl leading-relaxed mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Share private messages, images, or files with{" "}
          <strong>single-use links</strong>. No logs. No traces. Powered by{" "}
          <span className="font-semibold text-red-400">Appwrite</span>.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/home"
            className="h-14 px-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center font-bold transition-all hover:shadow-[0_0_40px_8px_rgba(255,0,0,0.2)]"
          >
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <button
            onClick={() =>
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="h-14 px-10 rounded-xl border border-red-600 bg-zinc-900/50 text-red-400 hover:bg-red-900/20 transition-all font-semibold"
          >
            Learn How It Works
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-24"
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-red-500 via-red-600 to-black bg-clip-text text-transparent"
          {...fadeInUp}
        >
          Key Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {/* Large Card */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-black/70 border border-red-600 p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <Lock className="text-red-500 mb-6" size={40} />
              <h3 className="text-3xl font-bold mb-4 text-red-400">Encrypted Storage</h3>
              <p className="text-zinc-400 max-w-sm">
                Client-side hashing ensures zero-knowledge encryption. Your data
                is encrypted before it ever leaves your device.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors" />
          </motion.div>

          {/* Small Cards */}
          <motion.div
            {...fadeInUp}
            className="rounded-[2rem] bg-black/70 border border-red-600 p-8 flex flex-col items-center text-center justify-center gap-4 shadow-xl hover:shadow-red-900/30 hover:scale-105 transition-transform"
          >
            <Ghost className="text-red-500" size={32} />
            <h3 className="font-bold text-xl">Vanish Mode</h3>
            <p className="text-sm text-zinc-500">
              Links self-destruct instantly after the first view.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="rounded-[2rem] bg-black/70 border border-red-600 p-8 flex flex-col items-center text-center justify-center gap-4 shadow-xl hover:shadow-red-900/30 hover:scale-105 transition-transform"
          >
            <Zap className="text-red-400" size={32} />
            <h3 className="font-bold text-xl">Instant Links</h3>
            <p className="text-sm text-zinc-500">
              Generate secure links in under 100ms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-red-500 via-red-600 to-black bg-clip-text text-transparent"
          {...fadeInUp}
        >
          How It Works
        </motion.h2>

        <div className="flex flex-col md:flex-row flex-wrap justify-center items-start gap-6">
          {[
            {
              icon: <FileText size={40} className="text-red-500" />,
              title: "Write or Upload",
              desc: "Compose a secret message or upload an image.",
            },
            {
              icon: <Timer size={40} className="text-red-400" />,
              title: "Set Expiry",
              desc: "Choose how long the secret stays alive.",
            },
            {
              icon: <Shield size={40} className="text-red-400" />,
              title: "Generate & Share",
              desc: "Create a unique one-time-use link.",
            },
            {
              icon: <Image size={40} className="text-red-500" />,
              title: "Auto-Destruct",
              desc: "After the first view, the secret disappears forever.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.2 }}
              className="flex-1 w-[300px] h-[200px] p-8 rounded-3xl bg-black/70 border border-red-600 flex flex-col items-center text-center gap-4 shadow-xl hover:shadow-red-900/30 hover:scale-105 transition-transform"
            >
              {item.icon}
              <h3 className="text-xl font-bold text-red-400">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-red-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-70">
            <div className="bg-white p-1 rounded-md">
              <Lock size={12} className="text-black" />
            </div>
            <span className="font-bold text-sm tracking-tighter ">
              ONE-TIME <span className="text-red-500">MSG</span>
            </span>
          </div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} Non-Custodial Secure Transfer Protocol
          </p>
          <div className="flex gap-6 text-zinc-500 text-xs font-medium">
            <a href="#" className="hover:text-red-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-red-500 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-red-500 transition-colors">
              Github
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}