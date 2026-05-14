import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Folder, MoreVertical, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { folderApi } from '../../api';
import { formatBytes } from '../../utils/helpers';
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
      whileHover={{ y: -4 }}
      className="group relative rounded-[24px] p-6 cursor-pointer transition-all duration-300 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-2xl hover:shadow-black/50"
      onClick={() => !menuOpen && !renaming && navigate(`/folder/${folder._id}`)}
    >
      {/* Top color strip */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[24px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${folder.color}, transparent)` }} />

      {/* Menu button */}
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
        className="absolute top-4 right-4 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
      >
        <MoreVertical className="w-[18px] h-[18px]" />
      </button>

      {/* Context menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
              className="absolute top-12 right-4 z-20 w-40 rounded-xl overflow-hidden shadow-2xl bg-[#18181b] border border-white/10 p-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setRenaming(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Rename
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Folder icon */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: `${folder.color}22` }}>
        <Folder className="w-7 h-7" style={{ color: folder.color, fill: `${folder.color}44` }} />
      </div>

      {/* Name */}
      {renaming ? (
        <form onSubmit={(e) => { e.preventDefault(); renameFolder(); }} onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => setRenaming(false)}
            className="w-full text-[15px] font-semibold px-3 py-1.5 rounded-lg outline-none bg-black/40 text-white border border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
        </form>
      ) : (
        <p className="text-[16px] font-semibold truncate mb-1.5 text-zinc-100 tracking-tight">
          {folder.name}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-[13px] font-medium text-zinc-500">
          {formatBytes(folder.size || 0)}
        </span>
        <ChevronRight className="w-[18px] h-[18px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}
