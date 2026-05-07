import React from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSuccess = (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      const decoded: any = jwtDecode(token);
      
      login(token, {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        sub: decoded.sub
      });
      
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Authentication failed');
    }
  };

  const handleError = () => {
    toast.error('Login Failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0B0F19]">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 px-4"
      >
        <GlassCard className="p-8 backdrop-blur-xl border-white/10 bg-white/[0.02]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Your Workspace</h1>
            <p className="text-gray-400 text-sm mt-2 text-center">Sign in to sync your documents securely.</p>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
            />
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            By continuing, you agree to RAGify's Terms of Service and Privacy Policy.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
