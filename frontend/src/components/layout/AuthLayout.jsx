import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8 sm:px-10 sm:py-12 bg-[#09090b]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Top left violet glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-violet-600/15 rounded-full blur-[120px] mix-blend-screen" />
        {/* Bottom center purple glow */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[400px] sm:h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px] mix-blend-screen" />
        {/* Right edge blue tint */}
        <div className="absolute top-[20%] right-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        {/* Logo Section */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] mb-6 text-[32px] sm:text-[36px] shadow-2xl bg-gradient-to-br from-indigo-500 to-violet-600 border border-white/20"
          >
            🐶
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-white mb-2"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-zinc-400 text-[15px] sm:text-[16px] font-medium"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Auth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[28px] px-6 py-8 sm:px-10 sm:py-10 shadow-[0_0_60px_rgba(124,58,237,0.15)] relative overflow-hidden"
        >
          {/* Subtle inner highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {children}

          <p className="mt-6 text-center text-[15px] text-zinc-400">
            {footerText}{' '}
            <Link
              to={footerLink}
              className="font-semibold text-white hover:text-indigo-400 transition-colors underline-offset-4 hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <div className="px-5 py-2.5 rounded-full text-[13px] text-center bg-white/[0.03] backdrop-blur-md border border-white/10 text-zinc-500 shadow-sm transition-all hover:bg-white/[0.05]">
            Demo: <span className="text-zinc-300 font-medium tracking-wide mx-1">demo@dobbyvault.io</span> / <span className="text-zinc-300 font-medium tracking-wide ml-1">demo123</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
