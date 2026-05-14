import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFolder, FiChevronRight, FiChevronDown, FiPlus,
  FiSun, FiMoon, FiLogOut, FiHome
} from 'react-icons/fi';
import { folderApi } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

// ─── Recursive tree node ─────────────────────────────────────────
function TreeNode({ folder, allFolders, depth = 0, currentId, onNavigate }) {
  const [open, setOpen] = useState(false);
  const children = allFolders.filter((f) => f.parentFolderId === folder._id);
  const isActive = currentId === folder._id;

  return (
    <div>
      <button
        onClick={() => { onNavigate(folder._id); setOpen((o) => !o); }}
        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all group"
        style={{
          paddingLeft: `${12 + depth * 14}px`,
          background: isActive ? 'var(--accent-glow)' : 'transparent',
          color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
          border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        {children.length > 0 ? (
          open
            ? <FiChevronDown className="w-3 h-3 shrink-0 opacity-60" />
            : <FiChevronRight className="w-3 h-3 shrink-0 opacity-60" />
        ) : (
          <span className="w-3 h-3 shrink-0" />
        )}
        <FiFolder className="w-4 h-4 shrink-0" style={{ color: folder.color || '#6366f1' }} />
        <span className="truncate flex-1 text-left">{folder.name}</span>
      </button>

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
              <TreeNode key={child._id} folder={child} allFolders={allFolders}
                depth={depth + 1} currentId={currentId} onNavigate={onNavigate} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────
export default function Sidebar({ currentFolderId, onCreateFolder }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['folders-all'],
    queryFn: () => folderApi.getAll().then((r) => r.data.folders),
    staleTime: 30000,
  });

  const allFolders = data || [];
  const rootFolders = allFolders.filter((f) => !f.parentFolderId);

  const handleNavigate = (id) => navigate(`/folder/${id}`);
  const handleHome = () => navigate('/dashboard');

  return (
    <aside className="flex flex-col h-full" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xl"
          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
          🐶
        </div>
        <span className="font-bold text-lg gradient-text">Dobby Vault</span>
      </div>

      {/* Nav */}
      <div className="p-3 space-y-1" style={{ borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={handleHome}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: !currentFolderId ? 'var(--accent-glow)' : 'transparent',
            color: !currentFolderId ? 'var(--accent-light)' : 'var(--text-secondary)',
            border: !currentFolderId ? '1px solid var(--border-accent)' : '1px solid transparent',
          }}
          onMouseEnter={(e) => { if (currentFolderId) e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseLeave={(e) => { if (currentFolderId) e.currentTarget.style.background = 'transparent'; }}
        >
          <FiHome className="w-4 h-4 shrink-0" />
          My Drive
        </button>

        <button
          onClick={onCreateFolder}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ color: 'var(--text-secondary)', border: '1px solid transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <FiPlus className="w-4 h-4 shrink-0" />
          New Folder
        </button>
      </div>

      {/* Folder tree */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-2"
          style={{ color: 'var(--text-muted)' }}>Folders</p>
        {rootFolders.length === 0 ? (
          <p className="text-xs px-3 py-2" style={{ color: 'var(--text-muted)' }}>No folders yet</p>
        ) : (
          rootFolders.map((f) => (
            <TreeNode key={f._id} folder={f} allFolders={allFolders}
              currentId={currentFolderId} onNavigate={handleNavigate} />
          ))
        )}
      </div>

      {/* User + controls */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex items-center gap-3 px-3 py-2 rounded-xl"
          style={{ background: 'var(--bg-hover)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
          <button onClick={logout} title="Logout"
            className="p-1 rounded transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
