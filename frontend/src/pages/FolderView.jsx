import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder, Plus, UploadCloud, Search, LayoutGrid,
  List, ChevronRight, Home, Image as ImageIcon, HardDrive
} from 'lucide-react';
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-white font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <div className="w-64 shrink-0 hidden md:flex flex-col h-full border-r border-white/5 bg-[#09090b]/50">
        <Sidebar currentFolderId={id} onCreateFolder={() => setShowCreate(true)} />
      </div>

      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-20 px-6 md:px-10 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 shadow-sm shadow-black/10">
          
          <div className="flex items-center gap-4 flex-wrap flex-1 min-w-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto hide-scrollbar">
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 text-sm transition-all shrink-0 p-2 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <Home className="w-[18px] h-[18px]" />
              </button>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb._id} className="flex items-center gap-1.5 shrink-0">
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                  {i < breadcrumbs.length - 1 ? (
                    <button onClick={() => navigate(`/folder/${crumb._id}`)}
                      className="text-[15px] font-medium transition-all text-zinc-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5"
                    >
                      {crumb.name}
                    </button>
                  ) : (
                    <span className="text-[15px] font-semibold text-zinc-100 tracking-tight px-2 py-1">
                      {crumb.name}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Folder stats */}
            {currentFolder && (
              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-2 text-[13px] font-medium px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400">
                  <HardDrive className="w-[14px] h-[14px]" />
                  {formatBytes(currentFolder.size || 0)}
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-1 xl:pb-0 hide-scrollbar">
            {/* Search */}
            <div className="relative group min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full pl-10 pr-4 h-10 rounded-xl text-[14px] outline-none transition-all bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/[0.06] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 px-4 pr-8 rounded-xl text-[14px] outline-none cursor-pointer transition-all bg-white/[0.03] border border-white/10 text-zinc-300 hover:bg-white/[0.06] focus:border-indigo-500 appearance-none bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
            >
              <option value="newest" className="bg-[#09090b] text-white">Newest</option>
              <option value="name" className="bg-[#09090b] text-white">Name</option>
              <option value="size" className="bg-[#09090b] text-white">Size</option>
            </select>

            {/* View toggle */}
            <div className="flex rounded-xl p-1 bg-white/[0.03] border border-white/10 shrink-0">
              {[['grid', LayoutGrid], ['list', List]].map(([mode, Icon]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === mode ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </button>
              ))}
            </div>

            {/* Actions */}
            <button onClick={() => setShowCreate(true)}
              className="h-10 px-4 sm:px-5 flex items-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/20 shrink-0 hover:-translate-y-0.5"
            >
              <Plus className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">Folder</span>
            </button>

            <button onClick={() => setShowUpload((s) => !s)}
              className={`h-10 px-4 sm:px-5 flex items-center gap-2 rounded-xl text-[14px] font-semibold transition-all border shrink-0 hover:-translate-y-0.5 ${
                showUpload 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                  : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.06]'
              }`}
            >
              <UploadCloud className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto space-y-12">
          {/* Upload zone */}
          <AnimatePresence>
            {showUpload && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -20 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="overflow-hidden"
              >
                <div className="p-1 pb-6">
                  <UploadZone folderId={id} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subfolders */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-[18px] font-semibold tracking-tight text-white flex items-center gap-2.5">
                <Folder className="w-[20px] h-[20px] text-indigo-400" />
                Folders
              </h2>
              {!folderLoading && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/10 text-zinc-400">
                  {filteredFolders.length}
                </span>
              )}
            </div>

            {folderLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <FolderSkeleton key={i} />)}
              </div>
            ) : filteredFolders.length === 0 ? (
              <EmptyState 
                icon={<Folder className="w-12 h-12 text-zinc-500" />} 
                title={search ? 'No matching folders' : 'No subfolders'} 
                desc={!search && 'Create a folder to start organizing.'}
                action={!search && (
                  <button onClick={() => setShowCreate(true)} className="mt-4 text-[14px] font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
                    + Create subfolder
                  </button>
                )}
              />
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 md:gap-6'
                : 'flex flex-col gap-3'}>
                {filteredFolders.map((f) => <FolderCard key={f._id} folder={f} currentFolderId={id} viewMode={viewMode} />)}
              </div>
            )}
          </section>

          {/* Images */}
          <section>
            <div className="flex items-center gap-3 mb-6 pt-4 border-t border-white/5">
              <h2 className="text-[18px] font-semibold tracking-tight text-white flex items-center gap-2.5">
                <ImageIcon className="w-[20px] h-[20px] text-violet-400" />
                Images
              </h2>
              {!imagesLoading && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/10 text-zinc-400">
                  {filteredImages.length}
                </span>
              )}
            </div>

            {imagesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-5">
                {Array.from({ length: 8 }).map((_, i) => <ImageSkeleton key={i} />)}
              </div>
            ) : filteredImages.length === 0 ? (
              <EmptyState 
                icon={<ImageIcon className="w-12 h-12 text-zinc-500" />} 
                title={search ? 'No matching images' : 'No images yet'} 
                desc={!search && 'Upload images to see them here.'}
                action={!search && (
                  <button onClick={() => setShowUpload(true)} className="mt-4 text-[14px] font-medium text-violet-400 hover:text-violet-300 hover:underline">
                    + Upload images
                  </button>
                )}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-5">
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

function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 rounded-[28px] border border-white/5 bg-white/[0.01]">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-white/[0.03] border border-white/5 shadow-inner">
        {icon}
      </div>
      <h3 className="text-[16px] font-semibold text-white mb-1.5 tracking-tight">{title}</h3>
      {desc && <p className="text-[14px] text-zinc-500 max-w-sm leading-relaxed">{desc}</p>}
      {action}
    </div>
  );
}
