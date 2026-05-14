import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Eye, Download, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { imageApi } from '../../api';
import { formatBytes, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

// Lightbox viewer
function Lightbox({ image, onClose }) {
  return (
    <AnimatePresence>
      {image && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-dark-950/90 backdrop-blur-2xl flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.15 } }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
            onClick={onClose}
          >
            <motion.div
              className="relative max-w-5xl w-full h-[85vh] pointer-events-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{image.name}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{formatBytes(image.size)} • {formatDate(image.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.a
                    href={image.url}
                    download={image.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                  </motion.a>
                  <motion.button
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 w-full bg-dark-900 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 relative flex items-center justify-center p-4">
                <motion.img
                  src={image.url}
                  alt={image.name}
                  className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Image Card Component
export default function ImageCard({ image, folderId }) {
  const [lightbox, setLightbox] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const qc = useQueryClient();

  const { mutate: deleteImage, isPending } = useMutation({
    mutationFn: () => imageApi.delete(image._id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['images', folderId] });
      qc.invalidateQueries({ queryKey: ['folder', folderId] });
      qc.invalidateQueries({ queryKey: ['folders-all'] });
      toast.success('Image deleted.');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Delete failed.'),
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Delete "${image.name}"?`)) deleteImage();
    setMenuOpen(false);
  };

  return (
    <>
      <Lightbox image={lightbox ? image : null} onClose={() => setLightbox(false)} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -6 }}
        className="group relative rounded-[20px] overflow-hidden cursor-pointer bg-dark-900 border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 flex flex-col"
        onClick={() => setLightbox(true)}
      >
        {/* Image container */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-dark-950 relative">
          <motion.img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Subtle gradient overlay at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover actions */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="flex gap-2.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-lg border border-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
                <motion.a
                  href={image.url}
                  download={image.name}
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-lg border border-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Top Right menu button */}
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-dark-950/60 hover:bg-dark-950/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 border border-white/10"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Context menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-12 right-3 z-30 w-36 bg-dark-950 border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl supports-[backdrop-filter]:bg-dark-950/80"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full px-4 py-3 text-[14px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Info section */}
        <div className="p-4 flex flex-col justify-end min-h-[76px] bg-dark-900 group-hover:bg-dark-800 transition-colors">
          <div className="flex items-start gap-2">
            <ImageIcon className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-white truncate tracking-tight group-hover:text-violet-100 transition-colors">
                {image.name}
              </p>
              <p className="text-[12px] font-medium text-zinc-500 mt-0.5 uppercase tracking-wide">
                {formatBytes(image.size)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
