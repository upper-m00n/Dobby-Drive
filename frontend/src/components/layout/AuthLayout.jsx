import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-10 py-16 bg-[#09090b]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-indigo-600/20 rounded-full blur-[100px] opacity-50 mix-blend-screen transform -translate-y-1/2 -translate-x-1/4" />
        <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-600/20 rounded-full blur-[100px] opacity-50 mix-blend-screen transform translate-y-1/4 translate-x-1/3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-3xl shadow-2xl bg-gradient-to-br from-indigo-500 to-violet-600 border border-white/10">
            🐶
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{title}</h1>
          <p className="text-zinc-400 text-[15px]">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[28px] p-12 sm:p-10 shadow-2xl shadow-black/50">
          {children}

          <p className="mt-8 text-center text-[14px] text-zinc-400">
            {footerText}{' '}
            <Link
              to={footerLink}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-6 px-4 py-3 rounded-2xl text-[13px] text-center bg-white/[0.02] border border-white/5 text-zinc-500 shadow-sm">
          Demo: <span className="text-indigo-400 font-medium">demo@dobbyvault.io</span> / <span className="text-indigo-400 font-medium">demo123</span>
        </div>
      </motion.div>
    </div>
  );
}
