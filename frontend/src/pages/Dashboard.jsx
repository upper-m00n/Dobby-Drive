import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Folder, Search, LayoutGrid, List, Home } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import FolderCard from '../components/folder/FolderCard';
import CreateFolderModal from '../components/folder/CreateFolderModal';
import { FolderSkeleton } from '../components/ui/Skeletons';
import { folderApi } from '../api';

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const { data: folderData, isLoading: foldersLoading } = useQuery({
    queryKey: ['folder', 'root'],
    queryFn: () => folderApi.getById('root').then((r) => r.data),
  });

  const subfolders = folderData?.subfolders || [];

  const filteredFolders = useMemo(() => {
    let f = subfolders.filter((folder) => folder?.name?.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'name') f = [...f].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    if (sort === 'size') f = [...f].sort((a, b) => (b?.size || 0) - (a?.size || 0));
    if (sort === 'newest') f = [...f].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
    return f;
  }, [subfolders, search, sort]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-white font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <div className="w-64 shrink-0 hidden md:flex flex-col h-full border-r border-white/5 bg-[#09090b]/50">
        <Sidebar currentFolderId={null} onCreateFolder={() => setShowCreate(true)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-20 px-6 md:px-10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 shadow-sm shadow-black/10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-[16px] font-semibold text-zinc-100 tracking-tight">My Drive</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0" style={{ scrollbarWidth: 'none' }}>
            {/* Search */}
            <div className="relative group min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search folders…"
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

            {/* View */}
            <div className="flex rounded-xl p-1 bg-white/[0.03] border border-white/10 shrink-0">
              {[['grid', LayoutGrid], ['list', List]].map(([mode, Icon]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === mode ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </button>
              ))}
            </div>

            {/* New Folder */}
            <button
              onClick={() => setShowCreate(true)}
              className="h-10 px-4 sm:px-5 flex items-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/20 shrink-0 hover:-translate-y-0.5"
            >
              <Plus className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">New Folder</span>
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto space-y-12">
          {/* Folders Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-[18px] font-semibold tracking-tight text-white flex items-center gap-2.5">
                <Folder className="w-[20px] h-[20px] text-indigo-400" />
                Folders
              </h2>
              {!foldersLoading && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/10 text-zinc-400">
                  {filteredFolders.length}
                </span>
              )}
            </div>

            {foldersLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <FolderSkeleton key={i} />)}
              </div>
            ) : filteredFolders.length === 0 ? (
              <EmptyState
                icon={<Folder className="w-12 h-12 text-zinc-500" />}
                title={search ? 'No folders found' : 'Your drive is empty'}
                desc={search ? 'Try adjusting your search query.' : 'Create your first folder to start organizing.'}
                action={!search && (
                  <button onClick={() => setShowCreate(true)}
                    className="mt-6 px-6 py-3 rounded-xl text-[15px] font-semibold text-white transition-all bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:-translate-y-0.5">
                    Create Folder
                  </button>
                )}
              />
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 md:gap-6'
                : 'flex flex-col gap-3'}>
                {filteredFolders.map((f) => (
                  <FolderCard key={f._id} folder={f} currentFolderId={null} viewMode={viewMode} />
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
    <div className="flex flex-col items-center justify-center py-28 text-center px-4 rounded-[32px] border border-white/5 bg-white/[0.01]">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-white/[0.03] border border-white/5 shadow-inner">
        {icon}
      </div>
      <h3 className="text-[18px] font-semibold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-[15px] text-zinc-500 max-w-sm leading-relaxed">{desc}</p>
      {action}
    </div>
  );
}
