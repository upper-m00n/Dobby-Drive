import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiZoomIn, FiDownload } from 'react-icons/fi';
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-contain rounded-2xl"
              style={{ maxHeight: '80vh' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 rounded-b-2xl"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
              <p className="text-white font-medium text-sm">{image.name}</p>
              <p className="text-gray-400 text-xs">{formatBytes(image.size)} · {formatDate(image.createdAt)}</p>
            </div>
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: 'rgba(0,0,0,0.5)' }}>
              ✕
            </button>
            <a href={image.url} download={image.name} target="_blank" rel="noopener noreferrer"
              className="absolute top-4 right-14 w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={(e) => e.stopPropagation()}>
              <FiDownload className="w-4 h-4" />
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
              className="absolute inset-0 flex items-center justify-center gap-2"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.15)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all"
                style={{ background: 'rgba(239,68,68,0.7)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.7)'}
              >
                <FiTrash2 className="w-4 h-4" />
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
