import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder } from 'lucide-react';
import { folderApi } from '../../api';
import { FOLDER_COLORS } from '../../utils/helpers';
import toast from 'react-hot-toast';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
};

export default function CreateFolderModal({ isOpen, onClose, parentFolderId }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(FOLDER_COLORS[0]);
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => folderApi.create({ name: name.trim(), parentFolderId, color }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['folders-all'] });
      qc.invalidateQueries({ queryKey: ['folder', parentFolderId || 'root'] });
      toast.success('Folder created! 📁');
      setName('');
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create folder.'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Folder name is required.');
    mutate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[460px] bg-dark-900 border border-white/10 rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-black/80 overflow-hidden"
          >
            {/* Background subtle glow */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors duration-500"
              style={{ background: color }}
            />

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header */}
            <div className="mb-8 relative z-10">
              <h2 className="text-[22px] font-bold text-white tracking-tight mb-2">
                New Folder
              </h2>
              <p className="text-[14px] text-zinc-400">
                Organize your files with custom colors
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
              {/* Folder preview & input group */}
              <div className="space-y-5">
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-[88px] h-[88px] rounded-[24px] flex items-center justify-center relative shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, ${color}22, ${color}05)`,
                      border: `1px solid ${color}40`,
                    }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Folder
                      className="w-10 h-10"
                      style={{ color, fill: `${color}40` }}
                    />
                    <div 
                      className="absolute inset-0 rounded-[24px] blur-xl opacity-20"
                      style={{ background: color }}
                    />
                  </motion.div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-zinc-300 mb-2">Folder Name</label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Project Assets"
                    className="w-full h-[46px] px-4 rounded-[14px] text-[15px] font-medium outline-none transition-all bg-dark-950 border border-white/10 text-white placeholder:text-zinc-600 focus:bg-white/[0.02] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 shadow-inner"
                  />
                </div>
              </div>

              {/* Color selector */}
              <div>
                <label className="block text-[13px] font-medium text-zinc-300 mb-3">Theme Color</label>
                <div className="flex flex-wrap gap-3">
                  {FOLDER_COLORS.map((c) => (
                    <motion.button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-9 h-9 rounded-full transition-all flex items-center justify-center"
                      style={{ background: c }}
                      animate={{
                        scale: color === c ? 1.15 : 1,
                        boxShadow: color === c ? `0 0 0 2px #111118, 0 0 0 4px ${c}` : '0 0 0 0px transparent',
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-6 border-t border-white/5">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-[46px] rounded-[14px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium text-[14px] transition-colors border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isPending || !name.trim()}
                  className="flex-1 h-[46px] rounded-[14px] bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold text-[14px] transition-colors shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-400/30"
                  whileHover={!isPending && name.trim() ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!isPending && name.trim() ? { scale: 0.98 } : {}}
                >
                  {isPending ? 'Creating...' : 'Create Folder'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
