import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiFolder, FiMoreVertical, FiEdit2, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { folderApi } from '../../api';
import { formatBytes, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function FolderCard({ folder, currentFolderId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { mutate: deleteFolder } = useMutation({
    mutationFn: () => folderApi.delete(folder._id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['folders-all'] });
      qc.invalidateQueries({ queryKey: ['folder', currentFolderId || 'root'] });
      toast.success('Folder deleted.');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Delete failed.'),
  });

  const { mutate: renameFolder } = useMutation({
    mutationFn: () => folderApi.update(folder._id, { name: newName.trim() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['folders-all'] });
      qc.invalidateQueries({ queryKey: ['folder', currentFolderId || 'root'] });
      setRenaming(false);
      toast.success('Folder renamed.');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Rename failed.'),
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Delete "${folder.name}" and all its contents?`)) deleteFolder();
    setMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group relative rounded-xl p-4 cursor-pointer transition-all"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = `${folder.color}66`}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      onClick={() => !menuOpen && !renaming && navigate(`/folder/${folder._id}`)}
    >
      {/* Top color strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, ${folder.color}, transparent)` }} />

      {/* Menu button */}
      <button
        id={`folder-menu-${folder._id}`}
        onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
        className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
      >
        <FiMoreVertical className="w-3.5 h-3.5" />
      </button>

      {/* Context menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-10 right-3 z-20 rounded-xl overflow-hidden shadow-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', minWidth: '140px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setRenaming(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiEdit2 className="w-3.5 h-3.5" /> Rename
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-all"
                style={{ color: '#ef4444' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Folder icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${folder.color}22` }}>
        <FiFolder className="w-7 h-7" style={{ color: folder.color }} />
      </div>

      {/* Name */}
      {renaming ? (
        <form onSubmit={(e) => { e.preventDefault(); renameFolder(); }} onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => setRenaming(false)}
            className="w-full text-sm font-medium px-2 py-1 rounded-lg outline-none"
            style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid #6366f1' }}
          />
        </form>
      ) : (
        <p className="text-sm font-semibold truncate mb-1" style={{ color: 'var(--text-primary)' }}>
          {folder.name}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {formatBytes(folder.size || 0)}
        </span>
        <FiChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-all"
          style={{ color: 'var(--text-muted)' }} />
      </div>
    </motion.div>
  );
}
