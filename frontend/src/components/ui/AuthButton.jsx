import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function AuthButton({ children, loading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      className="w-full h-[56px] mt-4 flex items-center justify-center gap-2 rounded-[16px] text-[16px] font-bold text-white transition-all bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-500 bg-[length:200%_auto] hover:bg-[position:right_center] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/30"
      {...props}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </motion.button>
  );
}
