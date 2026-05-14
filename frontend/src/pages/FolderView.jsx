import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FiFolder, FiPlus, FiUploadCloud, FiSearch, FiGrid,
  FiList, FiChevronRight, FiHome, FiImage, FiHardDrive
} from 'react-icons/fi';
import Sidebar from '../components/layout/Sidebar';
import FolderCard from '../components/folder/FolderCard';
import ImageCard from '../components/image/ImageCard';
import CreateFolderModal from '../components/folder/CreateFolderModal';
import UploadZone from '../components/image/UploadZone';
import { FolderSkeleton, ImageSkeleton } from '../components/ui/Skeletons';
import { folderApi, imageApi } from '../api';
import { formatBytes } from '../utils/helpers';

export default function FolderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const { data: folderData, isLoading: folderLoading } = useQuery({
    queryKey: ['folder', id],
    queryFn: () => folderApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

  const { data: imagesData, isLoading: imagesLoading } = useQuery({
    queryKey: ['images', id],
    queryFn: () => imageApi.getByFolder(id).then((r) => r.data.images),
    enabled: !!id,
  });

  const currentFolder = folderData?.folder;
  const subfolders = folderData?.subfolders || [];
  const breadcrumbs = folderData?.breadcrumbs || [];
  const images = imagesData || [];

  const filteredFolders = useMemo(() => {
    let f = subfolders.filter((folder) => folder.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'name') f = [...f].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'size') f = [...f].sort((a, b) => (b.size || 0) - (a.size || 0));
    if (sort === 'newest') f = [...f].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return f;
  }, [subfolders, search, sort]);

  const filteredImages = useMemo(() => {
    let imgs = images.filter((img) => img.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'newest') imgs = [...imgs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'size') imgs = [...imgs].sort((a, b) => b.size - a.size);
    if (sort === 'name') imgs = [...imgs].sort((a, b) => a.name.localeCompare(b.name));
    return imgs;
  }, [images, search, sort]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className="w-60 shrink-0 hidden md:flex flex-col h-full">
        <Sidebar currentFolderId={id} onCreateFolder={() => setShowCreate(true)} />
      </div>

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4"
          style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto">
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 text-sm transition-all shrink-0 p-1 rounded"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-light)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <FiHome className="w-4 h-4" />
              </button>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb._id} className="flex items-center gap-1.5 shrink-0">
                  <FiChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  {i < breadcrumbs.length - 1 ? (
                    <button onClick={() => navigate(`/folder/${crumb._id}`)}
                      className="text-sm transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                      {crumb.name}
                    </button>
                  ) : (
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {crumb.name}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Folder stats */}
            {currentFolder && (
              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                  <FiHardDrive className="w-3 h-3" />
                  {formatBytes(currentFolder.size || 0)}
                </span>
              </div>
            )}

            {/* Search */}
            <div className="relative hidden sm:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-44"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Sort */}
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>

            {/* View toggle */}
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

            {/* Actions */}
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              <FiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Folder</span>
            </button>

            <button onClick={() => setShowUpload((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: showUpload ? 'var(--accent-glow)' : 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: showUpload ? 'var(--accent-light)' : 'var(--text-secondary)',
              }}>
              <FiUploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Upload zone */}
          {showUpload && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
              <UploadZone folderId={id} />
            </motion.div>
          )}

          {/* Subfolders */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FiFolder className="w-4 h-4" style={{ color: '#6366f1' }} />
                Folders
                <span className="text-xs px-2 py-0.5 rounded-full font-normal"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                  {filteredFolders.length}
                </span>
              </h2>
            </div>

            {folderLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <FolderSkeleton key={i} />)}
              </div>
            ) : filteredFolders.length === 0 ? (
              <EmptyFolders onCreate={() => setShowCreate(true)} hasSearch={!!search} />
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'space-y-2'}>
                {filteredFolders.map((f) => <FolderCard key={f._id} folder={f} currentFolderId={id} />)}
              </div>
            )}
          </section>

          {/* Images */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FiImage className="w-4 h-4" style={{ color: '#818cf8' }} />
                Images
                <span className="text-xs px-2 py-0.5 rounded-full font-normal"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                  {filteredImages.length}
                </span>
              </h2>
            </div>

            {imagesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <ImageSkeleton key={i} />)}
              </div>
            ) : filteredImages.length === 0 ? (
              <EmptyImages onUpload={() => setShowUpload(true)} hasSearch={!!search} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredImages.map((img) => <ImageCard key={img._id} image={img} folderId={id} />)}
              </div>
            )}
          </section>
        </div>
      </main>

      <CreateFolderModal isOpen={showCreate} onClose={() => setShowCreate(false)} parentFolderId={id} />
    </div>
  );
}

function EmptyFolders({ onCreate, hasSearch }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
        style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
        <FiFolder className="w-8 h-8" />
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        {hasSearch ? 'No matching folders' : 'No subfolders'}
      </p>
      {!hasSearch && (
        <button onClick={onCreate} className="mt-3 text-sm font-medium" style={{ color: 'var(--accent-light)' }}>
          + Create subfolder
        </button>
      )}
    </div>
  );
}

function EmptyImages({ onUpload, hasSearch }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
        style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
        <FiImage className="w-8 h-8" />
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        {hasSearch ? 'No matching images' : 'No images yet'}
      </p>
      {!hasSearch && (
        <button onClick={onUpload} className="mt-3 text-sm font-medium" style={{ color: 'var(--accent-light)' }}>
          + Upload images
        </button>
      )}
    </div>
  );
}
