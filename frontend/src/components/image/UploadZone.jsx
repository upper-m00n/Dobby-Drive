import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiCheck } from 'react-icons/fi';
import { imageApi } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { formatBytes } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function UploadZone({ folderId }) {
  const [uploads, setUploads] = useState([]); // [{file, progress, status, id}]
  const qc = useQueryClient();

  const uploadFile = useCallback(async (file) => {
    const id = Math.random().toString(36).slice(2);
    setUploads((u) => [...u, { id, name: file.name, size: file.size, progress: 0, status: 'uploading' }]);

    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folderId', folderId);

      await imageApi.upload(fd, (pct) => {
        setUploads((u) => u.map((item) => (item.id === id ? { ...item, progress: pct } : item)));
      });

      setUploads((u) => u.map((item) => (item.id === id ? { ...item, status: 'done', progress: 100 } : item)));
      qc.invalidateQueries({ queryKey: ['images', folderId] });
      qc.invalidateQueries({ queryKey: ['folder', folderId] });
      qc.invalidateQueries({ queryKey: ['folders-all'] });

      setTimeout(() => setUploads((u) => u.filter((item) => item.id !== id)), 3000);
    } catch (err) {
      setUploads((u) => u.map((item) => (item.id === id ? { ...item, status: 'error' } : item)));
      toast.error(err.response?.data?.message || `Failed to upload ${file.name}`);
    }
  }, [folderId, qc]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(uploadFile);
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 20 * 1024 * 1024,
  });

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'dropzone-active' : ''}`}
        style={{
          borderColor: isDragActive ? '#6366f1' : 'var(--border)',
          background: isDragActive ? 'rgba(99,102,241,0.05)' : 'var(--bg-card)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.03)'; }}
        onMouseLeave={(e) => { if (!isDragActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; } }}
      >
        <input {...getInputProps()} id="image-upload-input" />
        <motion.div
          animate={{ y: isDragActive ? -4 : 0 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--accent-glow)' }}>
            <FiUploadCloud className="w-7 h-7" style={{ color: '#6366f1' }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {isDragActive ? 'Drop images here!' : 'Drag & drop images'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              or click to browse · Max 20MB per file
            </p>
          </div>
        </motion.div>
      </div>

      {/* Upload progress list */}
      <AnimatePresence>
        {uploads.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-3 space-y-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {item.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatBytes(item.size)}</p>
              </div>
              <span className="shrink-0">
                {item.status === 'done' && <FiCheck className="w-4 h-4" style={{ color: '#10b981' }} />}
                {item.status === 'error' && <FiX className="w-4 h-4" style={{ color: '#ef4444' }} />}
                {item.status === 'uploading' && (
                  <span className="text-xs font-mono" style={{ color: 'var(--accent-light)' }}>
                    {item.progress}%
                  </span>
                )}
              </span>
            </div>
            {item.status === 'uploading' && (
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                <div className="progress-bar" style={{ width: `${item.progress}%` }} />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
