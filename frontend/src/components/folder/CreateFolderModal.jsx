import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFolder } from 'react-icons/fi';
import { folderApi } from '../../api';
import { FOLDER_COLORS } from '../../utils/helpers';
import toast from 'react-hot-toast';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm glass rounded-2xl p-6 z-10"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                New Folder
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-all"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preview */}
              <div className="flex items-center justify-center py-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: `${color}22`, border: `2px solid ${color}44` }}>
                  <FiFolder className="w-10 h-10" style={{ color }} />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Folder Name
                </label>
                <input
                  id="folder-name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Projects"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {FOLDER_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-full transition-all"
                      style={{
                        background: c,
                        transform: color === c ? 'scale(1.25)' : 'scale(1)',
                        boxShadow: color === c ? `0 0 0 2px var(--bg-card), 0 0 0 4px ${c}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}>
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: isPending ? 'var(--text-muted)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                  }}>
                  {isPending ? 'Creating…' : 'Create Folder'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
