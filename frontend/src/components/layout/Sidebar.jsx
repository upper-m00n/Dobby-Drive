import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder, ChevronRight, Plus,
  Sun, Moon, LogOut, Home, Settings
} from 'lucide-react';
import { folderApi } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

function TreeNode({ folder, allFolders, depth = 0, currentId, onNavigate }) {
  const [open, setOpen] = useState(false);
  const children = allFolders.filter((f) => f.parentFolderId === folder._id);
  const isActive = currentId === folder._id;

  return (
    <div>
      <motion.button
        onClick={() => { onNavigate(folder._id); setOpen((o) => !o); }}
        className={`w-full flex items-center gap-2.5 py-2 pr-3 rounded-lg text-sm font-medium transition-all group relative overflow-hidden ${
          isActive
            ? 'text-indigo-400 bg-white/[0.04]'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02]'
        }`}
        style={{ paddingLeft: `${16 + depth * 16}px` }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"
            layoutId="sidebar-active"
          />
        )}

        {children.length > 0 ? (
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
          </motion.div>
        ) : (
          <span className="w-3.5 h-3.5 shrink-0" />
        )}

        <Folder
          className="w-4 h-4 shrink-0"
          style={{ color: folder.color || '#8b5cf6' }}
          fill={isActive ? `${folder.color || '#8b5cf6'}40` : 'transparent'}
        />
        <span className="truncate flex-1 text-left text-[13px]">{folder.name}</span>
      </motion.button>

      <AnimatePresence>
        {open && children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children.map((child) => (
              <TreeNode
                key={child._id}
                folder={child}
                allFolders={allFolders}
                depth={depth + 1}
                currentId={currentId}
                onNavigate={onNavigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ currentFolderId, onCreateFolder }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['folders-all'],
    queryFn: () => folderApi.getAll().then((r) => r.data.folders),
    staleTime: 30000,
  });

  const allFolders = data || [];
  const rootFolders = allFolders.filter((f) => !f.parentFolderId);

  return (
    <aside className="flex flex-col h-full bg-transparent">
      {/* Header Logo */}
      <motion.div 
        className="px-6 py-6 flex items-center gap-3 shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0 shadow-lg shadow-indigo-500/20 bg-gradient-to-br from-indigo-500 to-violet-600 border border-indigo-400/30">
          ✨
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-[16px] text-white tracking-tight">Dobby Vault</h1>
        </div>
      </motion.div>

      {/* Primary Navigation */}
      <div className="px-3 py-2 space-y-1 shrink-0">
        <motion.button
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
            !currentFolderId
              ? 'text-indigo-400 bg-white/[0.04]'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02]'
          }`}
        >
          {!currentFolderId && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"
              layoutId="sidebar-active"
            />
          )}
          <Home className="w-[18px] h-[18px] shrink-0" />
          <span>My Drive</span>
        </motion.button>
      </div>

      {/* Folder tree */}
      <div className="flex-1 overflow-y-auto mt-4 px-3 hide-scrollbar">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Folders</p>
          <button onClick={onCreateFolder} className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {rootFolders.length === 0 ? (
          <p className="text-[13px] px-3 py-2 text-zinc-600 font-medium">No folders yet</p>
        ) : (
          <div className="space-y-0.5">
            {rootFolders.map((f) => (
              <TreeNode key={f._id} folder={f} allFolders={allFolders} currentId={currentFolderId} onNavigate={(id) => navigate(`/folder/${id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* User profile & controls */}
      <div className="p-4 mt-auto shrink-0 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-[14px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group cursor-pointer">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-inner"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold truncate text-zinc-100 tracking-tight leading-tight">{user?.name}</p>
            <p className="text-[11px] truncate text-zinc-500">{user?.email}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); logout(); }} title="Logout"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
          >
            <LogOut className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
