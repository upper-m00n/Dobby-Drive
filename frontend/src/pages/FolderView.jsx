import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder, Plus, UploadCloud, Search, LayoutGrid,
  List, ChevronRight, Home, Image as ImageIcon
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import AppLayout from '../components/layout/AppLayout';
import FolderCard from '../components/folder/FolderCard';
import ImageCard from '../components/image/ImageCard';
import CreateFolderModal from '../components/folder/CreateFolderModal';
import UploadZone from '../components/image/UploadZone';
import EmptyState from '../components/ui/EmptyState';
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
    let f = subfolders.filter((folder) => folder?.name?.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'name') f = [...f].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    if (sort === 'size') f = [...f].sort((a, b) => (b?.size || 0) - (a?.size || 0));
    if (sort === 'newest') f = [...f].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
    return f;
  }, [subfolders, search, sort]);

  const filteredImages = useMemo(() => {
    let imgs = images.filter((img) => img?.name?.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'newest') imgs = [...imgs].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
    if (sort === 'size') imgs = [...imgs].sort((a, b) => (b?.size || 0) - (a?.size || 0));
    if (sort === 'name') imgs = [...imgs].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    return imgs;
  }, [images, search, sort]);

  // Breadcrumb rendering
  const BreadcrumbComponent = (
    <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto hide-scrollbar py-1">
      <motion.button
        onClick={() => navigate('/dashboard')}
        className="flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        title="My Drive"
      >
        <Home className="w-4 h-4" />
      </motion.button>

      {breadcrumbs.map((crumb, i) => (
        <span key={crumb._id} className="flex items-center gap-2 flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          {i < breadcrumbs.length - 1 ? (
            <motion.button
              onClick={() => navigate(`/folder/${crumb._id}`)}
              className="text-sm font-medium text-zinc-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              {crumb.name}
            </motion.button>
          ) : (
            <span className="text-sm font-semibold text-white px-2 py-1 bg-white/[0.03] rounded-lg border border-white/5">
              {crumb.name}
            </span>
          )}
        </span>
      ))}
    </div>
  );

  const headerComponent = (
    <div className="w-full h-full px-6 md:px-8 flex items-center justify-between gap-4">
      {BreadcrumbComponent}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <motion.button
          onClick={() => setShowUpload(true)}
          className="btn-secondary gap-2 text-xs md:text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </motion.button>
      </div>
    </div>
  );

  const sidebarComponent = (
    <Sidebar currentFolderId={id} onCreateFolder={() => setShowCreate(true)} />
  );

  return (
    <>
      <AppLayout sidebar={sidebarComponent} header={headerComponent}>
        <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto min-h-full flex flex-col">
          {/* Folder info & Controls */}
          <div className="mb-10 space-y-6">
            {currentFolder && !folderLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 shadow-inner">
                      <Folder className="w-6 h-6" style={{ color: currentFolder.color || '#8b5cf6' }} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {currentFolder.name}
                    </h1>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 ml-[64px]">
                    {formatBytes(currentFolder.size || 0)} • {subfolders.length + images.length} items
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowCreate(true)}
                    className="btn-secondary gap-2 h-10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Folder</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setShowUpload((s) => !s)}
                    className={`h-10 px-4 flex items-center gap-2 rounded-lg text-sm font-semibold transition-all border ${
                      showUpload 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                        : 'bg-white/[0.05] border-white/10 text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload Files</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Search & Layout Toggles */}
            <div className="flex items-center gap-3 flex-wrap bg-white/[0.02] p-2 rounded-xl border border-white/5">
              <div className="relative group flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files and folders…"
                  className="w-full h-10 pl-9 pr-4 rounded-lg text-sm outline-none transition-all bg-transparent border border-transparent text-white placeholder:text-zinc-500 focus:bg-white/[0.05] focus:border-indigo-500/30"
                />
              </div>

              <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

              <motion.select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 px-3 py-2 rounded-lg text-sm outline-none transition-all bg-transparent border border-transparent text-zinc-300 hover:text-white cursor-pointer appearance-none focus:bg-white/[0.05] focus:border-white/10"
                style={{
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '16px',
                  paddingRight: '32px',
                }}
              >
                <option value="newest" className="bg-dark-900">Newest</option>
                <option value="name" className="bg-dark-900">Name A-Z</option>
                <option value="size" className="bg-dark-900">Size</option>
              </motion.select>

              <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

              <motion.div
                className="hidden md:flex rounded-lg p-1 bg-white/[0.02] border border-white/5 gap-1"
              >
                {[
                  { mode: 'grid', Icon: LayoutGrid },
                  { mode: 'list', Icon: List }
                ].map(({ mode, Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === mode
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Upload Zone */}
          <AnimatePresence>
            {showUpload && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -20 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="overflow-hidden mb-8"
              >
                <UploadZone folderId={id} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subfolders Section */}
          {filteredFolders.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <Folder className="w-5 h-5 text-indigo-400" />
                  Folders
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/[0.05] text-zinc-400 border border-white/10">
                  {filteredFolders.length}
                </span>
              </div>

              {folderLoading ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 md:gap-6'
                    : 'flex flex-col gap-3'
                }>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <FolderSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <motion.div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 md:gap-6'
                      : 'flex flex-col gap-3'
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {filteredFolders.map((f, i) => (
                    <motion.div
                      key={f._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <FolderCard folder={f} currentFolderId={id} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>
          )}

          {/* Images Section */}
          {(filteredImages.length > 0 || imagesLoading) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 flex-1"
            >
              <div className="flex items-center gap-3 mb-6 pt-4 border-t border-white/5">
                <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-violet-400" />
                  Files
                </h2>
                {!imagesLoading && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/[0.05] text-zinc-400 border border-white/10">
                    {filteredImages.length}
                  </span>
                )}
              </div>

              {imagesLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 md:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ImageSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 md:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {filteredImages.map((img, i) => (
                    <motion.div
                      key={img._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ImageCard image={img} folderId={id} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>
          )}

          {/* Empty state */}
          {!folderLoading && filteredFolders.length === 0 && filteredImages.length === 0 && (
            <div className="flex-1 flex flex-col justify-center pb-20 mt-10">
              <EmptyState
                icon={<Folder className="w-12 h-12 text-zinc-500" />}
                title={search ? 'No items found' : 'This folder is empty'}
                description={search
                  ? 'Try adjusting your search query.'
                  : 'Upload files or create folders to get started.'}
                action={
                  !search && (
                    <motion.button
                      onClick={() => setShowUpload(true)}
                      className="btn-primary gap-2 mt-6"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload Files
                    </motion.button>
                  )
                }
                variant="large"
              />
            </div>
          )}
        </div>
      </AppLayout>

      {/* Modals */}
      <CreateFolderModal isOpen={showCreate} onClose={() => setShowCreate(false)} parentFolderId={id} />
    </>
  );
}
