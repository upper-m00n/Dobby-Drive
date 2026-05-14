import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiUploadCloud, FiFolder, FiSearch, FiGrid, FiList, FiHome } from 'react-icons/fi';
import Sidebar from '../components/layout/Sidebar';
import FolderCard from '../components/folder/FolderCard';
import ImageCard from '../components/image/ImageCard';
import CreateFolderModal from '../components/folder/CreateFolderModal';
import UploadZone from '../components/image/UploadZone';
import { FolderSkeleton, ImageSkeleton } from '../components/ui/Skeletons';
import { folderApi, imageApi } from '../api';
import { formatBytes } from '../utils/helpers';

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const { data: folderData, isLoading: foldersLoading } = useQuery({
    queryKey: ['folder', 'root'],
    queryFn: () => folderApi.getById('root').then((r) => r.data),
  });

  const subfolders = folderData?.subfolders || [];

  const filteredFolders = useMemo(() => {
    let f = subfolders.filter((folder) =>
      folder.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === 'name') f = [...f].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'size') f = [...f].sort((a, b) => (b.size || 0) - (a.size || 0));
    if (sort === 'newest') f = [...f].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return f;
  }, [subfolders, search, sort]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className="w-60 shrink-0 hidden md:flex flex-col h-full">
        <Sidebar currentFolderId={null} onCreateFolder={() => setShowCreate(true)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4"
          style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FiHome className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-light)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>My Drive</span>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search folders…"
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-52"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>

          {/* View */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {[['grid', FiGrid], ['list', FiList]].map(([mode, Icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className="px-3 py-2 transition-all"
                style={{
                  background: viewMode === mode ? 'var(--accent-glow)' : 'var(--bg-card)',
                  color: viewMode === mode ? 'var(--accent-light)' : 'var(--text-muted)',
                }}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* New Folder */}
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Folder</span>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Folders Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FiFolder className="w-4 h-4" style={{ color: '#6366f1' }} />
                Folders
                {!foldersLoading && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-normal"
                    style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                    {filteredFolders.length}
                  </span>
                )}
              </h2>
            </div>

            {foldersLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <FolderSkeleton key={i} />)}
              </div>
            ) : filteredFolders.length === 0 ? (
              <EmptyState
                icon={<FiFolder className="w-12 h-12" />}
                title={search ? 'No folders found' : 'No folders yet'}
                desc={search ? 'Try a different search term.' : 'Create your first folder to get started.'}
                action={!search && (
                  <button onClick={() => setShowCreate(true)}
                    className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                    Create Folder
                  </button>
                )}
              />
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'space-y-2'}>
                {filteredFolders.map((f) => (
                  <FolderCard key={f._id} folder={f} currentFolderId={null} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <CreateFolderModal isOpen={showCreate} onClose={() => setShowCreate(false)} parentFolderId={null} />
    </div>
  );
}

function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
        {icon}
      </div>
      <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      {action}
    </div>
  );
}
