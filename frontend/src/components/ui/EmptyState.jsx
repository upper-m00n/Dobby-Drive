import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action, variant = 'default' }) {
  const isLarge = variant === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-16 md:py-24 text-center px-4 rounded-[32px] border border-white/5 bg-dark-900 shadow-inner ${isLarge ? 'min-h-[60vh]' : ''}`}
    >
      {/* Glow background behind icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150" />
        {/* Icon container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 shadow-xl ${isLarge ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20'} flex items-center justify-center`}
        >
          <div className={isLarge ? 'text-5xl md:text-6xl text-indigo-400' : 'text-3xl md:text-4xl text-indigo-400'}>
            {icon}
          </div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className={`${isLarge ? 'text-2xl md:text-[28px]' : 'text-lg md:text-[20px]'} font-bold text-white mb-2 tracking-tight`}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`text-zinc-400 mb-8 max-w-md mx-auto ${isLarge ? 'text-[16px]' : 'text-[14px]'}`}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
