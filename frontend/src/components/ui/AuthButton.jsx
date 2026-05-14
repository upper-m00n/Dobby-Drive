import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function AuthButton({ children, loading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      disabled={loading}
      className="w-full h-[52px] mt-2 flex items-center justify-center gap-2 rounded-[14px] text-[15px] font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
      {...props}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </motion.button>
  );
}
