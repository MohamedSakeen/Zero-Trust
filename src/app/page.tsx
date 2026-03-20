"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, Shield, Laptop, FileCheck, Lock, Activity, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-950">
      {/* Background Effects - Enhanced */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Main ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-cyan-600/8 rounded-full blur-[150px] animate-float" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[130px] animate-float-delayed" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/6 rounded-full blur-[120px] animate-float" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.7)_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-52 lg:pb-36">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center space-y-10 text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="space-y-6 max-w-[900px]"
                >
                  <div className="inline-flex items-center rounded-full border border-cyan-500/25 bg-cyan-500/8 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-sm mb-4 animate-border-glow">
                    <Activity className="h-3.5 w-3.5 mr-2" />
                    <span className="flex items-center gap-2">
                       Active Threat Monitoring 
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </span>
                    </span>
                  </div>
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                    <span className="text-slate-50 drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">Zero Trust</span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 animate-gradient-shift drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                      Examination Engine
                    </span>
                  </h1>
                  <p className="mx-auto max-w-[680px] text-slate-400 md:text-lg lg:text-xl pt-2 font-light leading-relaxed">
                    Continuous identity verification and behavioral biometrics
                    ensuring mathematical certainty in academic integrity.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Button size="lg" className="h-13 px-10 text-base group rounded-xl relative overflow-hidden" asChild>
                    <Link href="/login">
                      <span className="relative z-10 flex items-center">
                        Candidate Protocol 
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-13 px-10 text-base backdrop-blur-sm rounded-xl" asChild>
                    <Link href="/register">Initialize Registration</Link>
                  </Button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-slate-500"
                >
                  {[
                    { icon: Shield, text: "256-bit Encryption" },
                    { icon: Eye, text: "Biometric Auth" },
                    { icon: Zap, text: "Real-time Analysis" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-slate-600" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section – Enhanced */}
          <section className="w-full py-20 lg:py-28 border-t border-slate-800/50 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/60 to-slate-950 pointer-events-none" />
            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-14"
              >
                <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl mb-3">
                  Security Architecture
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto">
                  Multi-layered defense protocols that adapt in real-time to ensure zero-compromise examination integrity.
                </p>
              </motion.div>
              <div className="grid max-w-5xl mx-auto gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: Shield,
                    title: "Continuous Auth",
                    desc: "Persistent identity verification driven by behavioral analysis and keystroke dynamics.",
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10",
                    border: "border-cyan-500/15",
                    glow: "shadow-cyan-500/5"
                  },
                  {
                    icon: Laptop,
                    title: "Device Posture",
                    desc: "Cryptographic validation of hardware integrity and software constraints.",
                    color: "text-indigo-400",
                    bg: "bg-indigo-500/10",
                    border: "border-indigo-500/15",
                    glow: "shadow-indigo-500/5"
                  },
                  {
                    icon: Lock,
                    title: "Encrypted Delivery",
                    desc: "End-to-end encrypted packet transmission for secure exam data at rest and in transit.",
                    color: "text-violet-400",
                    bg: "bg-violet-500/10",
                    border: "border-violet-500/15",
                    glow: "shadow-violet-500/5"
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`group relative flex flex-col justify-between p-7 rounded-2xl border glass-card ${feature.border} hover:${feature.border} transition-all duration-300 shadow-lg hover:${feature.glow}`}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 space-y-5">
                      <div className={`inline-flex items-center justify-center p-3.5 rounded-xl ${feature.bg} ring-1 ring-white/5`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div className="space-y-2.5">
                        <h3 className="text-xl font-bold text-slate-100">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                    {/* Bottom highlight */}
                    <div className={`absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent ${feature.color === 'text-cyan-400' ? 'via-cyan-500/30' : feature.color === 'text-indigo-400' ? 'via-indigo-500/30' : 'via-violet-500/30'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        
        <footer className="w-full border-t border-slate-800/40 py-8 glass">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 font-medium">
              &copy; 2026 Zero Trust Security Systems.
            </p>
            <div className="flex gap-8 text-sm text-slate-400">
              <Link href="/admin-login" className="hover:text-cyan-400 transition-colors duration-300">
                Admin Terminal
              </Link>
              <Link href="/soc" className="hover:text-cyan-400 transition-colors duration-300">
                SOC Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
