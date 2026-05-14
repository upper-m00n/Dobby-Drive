import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ZoomIn, Download } from 'lucide-react';
import { imageApi } from '../../api';
import { formatBytes, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

// ─── Lightbox ─────────────────────────────────────────────────────
function Lightbox({ image, onClose }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
              style={{ maxHeight: '80vh' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
              <p className="text-white font-semibold text-[15px]">{image.name}</p>
              <p className="text-zinc-400 text-[13px] mt-1">{formatBytes(image.size)} · {formatDate(image.createdAt)}</p>
            </div>
            <button onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-md">
              ✕
            </button>
            <a href={image.url} download={image.name} target="_blank" rel="noopener noreferrer"
              className="absolute top-4 right-16 w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}>
              <Download className="w-[18px] h-[18px]" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Image Card ───────────────────────────────────────────────────
export default function ImageCard({ image, folderId }) {
  const [preview, setPreview] = useState(false);
  const [lightbox, setLightbox] = useState(false);
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
  };

  return (
    <>
      <Lightbox image={lightbox ? image : null} onClose={() => setLightbox(false)} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -3 }}
        className="group relative rounded-xl overflow-hidden cursor-pointer"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        onMouseEnter={() => setPreview(true)}
        onMouseLeave={() => setPreview(false)}
        onClick={() => setLightbox(true)}
      >
        {/* Image */}
        <div className="aspect-square overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: preview ? 'scale(1.05)' : 'scale(1)' }}
            loading="lazy"
          />
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center gap-3 backdrop-blur-[2px]"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all bg-white/20 hover:bg-white/40 shadow-lg"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all bg-red-500/80 hover:bg-red-500 shadow-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {image.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatBytes(image.size)}
          </p>
        </div>
      </motion.div>
    </>
  );
}
