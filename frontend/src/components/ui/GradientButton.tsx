import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative inline-flex items-center justify-center rounded-xl font-medium text-white shadow-lg overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-50 blur-lg transition-opacity" />
        <span className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 w-full h-full">
          {children}
        </span>
      </motion.button>
    );
  }
);
GradientButton.displayName = "GradientButton";
