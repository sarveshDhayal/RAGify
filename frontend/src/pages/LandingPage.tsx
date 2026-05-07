import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedNavbar } from '../components/AnimatedNavbar';
import { FloatingGradientBackground } from '../components/FloatingGradientBackground';
import { GradientButton } from '../components/ui/GradientButton';
import { GlassCard } from '../components/ui/GlassCard';
import { ArrowRight, Bot, Zap, Shield, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-purple-500/30">
      <FloatingGradientBackground />
      <AnimatedNavbar />

      <main className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mt-16 mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>RAGify 1.0 is now live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
            >
              Converse with your <br />
              <span className="text-gradient">Documents</span> in Real-Time.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
            >
              Upload your PDFs, textbooks, or research papers and extract insights instantly. Powered by advanced Retrieval-Augmented Generation and modern LLMs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4"
            >
              <Link to="/dashboard">
                <GradientButton className="text-lg px-8 py-4">
                  Start Chatting Now <ArrowRight className="w-5 h-5" />
                </GradientButton>
              </Link>
            </motion.div>
          </div>

          {/* Floating Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 animate-pulse" />
            <div className="relative rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
              <div className="absolute top-0 w-full h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="p-8 w-full h-full pt-16 flex gap-4">
                 <div className="w-1/3 bg-white/5 rounded-lg border border-white/5" />
                 <div className="w-2/3 bg-white/5 rounded-lg border border-white/5 flex flex-col p-4 gap-4">
                   <div className="w-3/4 h-8 bg-white/10 rounded-md" />
                   <div className="w-1/2 h-8 bg-purple-500/20 rounded-md ml-auto" />
                   <div className="w-full h-8 bg-white/10 rounded-md" />
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Lightning Fast"
              description="Vector-indexed semantic search ensures you get instant answers from thousands of pages."
            />
            <FeatureCard 
              icon={<Bot className="w-8 h-8 text-blue-400" />}
              title="Smart Citations"
              description="Every answer comes with precise source citations highlighting exactly where the info came from."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-green-400" />}
              title="Private & Secure"
              description="Your documents are embedded locally or stored securely. Your data remains strictly yours."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <GlassCard glow className="flex flex-col items-start text-left">
      <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </GlassCard>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
