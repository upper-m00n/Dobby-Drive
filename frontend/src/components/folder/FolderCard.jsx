import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Folder, MoreVertical, Edit2, Trash2, ChevronRight, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { folderApi } from '../../api';
import { formatBytes } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function FolderCard({ folder, currentFolderId, viewMode = 'grid' }) {
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

  const listView = viewMode === 'list';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={listView ? { paddingLeft: '8px' } : { y: -6 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative cursor-pointer transition-all duration-300 overflow-hidden rounded-[20px] ${
        listView
          ? 'p-4 flex items-center gap-4 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10'
          : 'p-6 bg-dark-900 border border-white/5 hover:bg-dark-800 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50'
      }`}
      onClick={() => !menuOpen && !renaming && navigate(`/folder/${folder._id}`)}
    >
      {/* Top accent bar (grid view only) */}
      {!listView && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, ${folder.color || '#8b5cf6'}, transparent)` }}
          layoutId={`folder-accent-${folder._id}`}
        />
      )}

      {/* Menu button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
        className="absolute top-4 right-4 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 text-zinc-500 hover:text-zinc-300 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MoreVertical className="w-5 h-5" />
      </motion.button>

      {/* Context menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="absolute top-14 right-4 z-30 rounded-xl shadow-2xl shadow-black/60 bg-dark-950 border border-white/10 overflow-hidden w-40 backdrop-blur-xl supports-[backdrop-filter]:bg-dark-950/80"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={(e) => { e.stopPropagation(); setRenaming(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5"
              >
                <Edit2 className="w-4 h-4" />
                Rename
              </motion.button>
              <motion.button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Grid view content */}
      {!listView && (
        <>
          {/* Folder icon area */}
          <motion.div
            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-6 flex-shrink-0 relative"
            style={{
              background: `linear-gradient(135deg, ${folder.color || '#8b5cf6'}22, ${folder.color || '#8b5cf6'}05)`,
              border: `1px solid ${folder.color || '#8b5cf6'}33`,
            }}
            whileHover={{ scale: 1.05, rotate: -2 }}
          >
            <Folder className="w-10 h-10" style={{ color: folder.color || '#8b5cf6', fill: `${folder.color || '#8b5cf6'}40` }} />
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" 
              style={{ background: folder.color || '#8b5cf6', filter: 'blur(24px)', opacity: 0.1 }}
            />
          </motion.div>

          {/* Folder info */}
          <div className="min-w-0 flex-1 flex flex-col justify-end">
            {renaming ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={(e) => { e.preventDefault(); renameFolder(); }}
                onClick={(e) => e.stopPropagation()}
                className="mb-3"
              >
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => setRenaming(false)}
                  className="w-full h-9 px-3 rounded-lg text-sm font-semibold outline-none transition-all bg-white/[0.05] border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500/30"
                />
              </motion.form>
            ) : (
              <h3 className="text-[16px] font-semibold truncate text-white mb-1.5 tracking-tight group-hover:text-indigo-100 transition-colors">
                {folder.name}
              </h3>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-2.5 text-[13px] text-zinc-500">
              <span className="font-medium bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5">{formatBytes(folder.size || 0)}</span>
            </div>
          </div>

          {/* Hover arrow */}
          <motion.div
            className="absolute bottom-5 right-5 text-zinc-600 group-hover:text-white bg-white/5 group-hover:bg-indigo-500 p-1.5 rounded-full transition-colors"
            animate={{ x: 0 }}
            whileHover={{ x: 2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </>
      )}

      {/* List view content */}
      {listView && (
        <>
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${folder.color || '#8b5cf6'}22, ${folder.color || '#8b5cf6'}05)`,
              border: `1px solid ${folder.color || '#8b5cf6'}33`,
            }}
          >
            <Folder className="w-6 h-6" style={{ color: folder.color || '#8b5cf6', fill: `${folder.color || '#8b5cf6'}40` }} />
          </motion.div>

          <div className="flex-1 min-w-0">
            {renaming ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={(e) => { e.preventDefault(); renameFolder(); }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => setRenaming(false)}
                  className="w-full max-w-xs h-9 px-3 rounded-lg text-sm font-semibold outline-none transition-all bg-white/[0.05] border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500/30"
                />
              </motion.form>
            ) : (
              <>
                <p className="text-[15px] font-semibold text-white truncate tracking-tight group-hover:text-indigo-100 transition-colors">
                  {folder.name}
                </p>
                <p className="text-[13px] text-zinc-500">{formatBytes(folder.size || 0)}</p>
              </>
            )}
          </div>

          <motion.div
            className="text-zinc-600 group-hover:text-white bg-white/5 group-hover:bg-indigo-500 p-1.5 rounded-full transition-colors flex-shrink-0"
            animate={{ x: 0 }}
            whileHover={{ x: 2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
