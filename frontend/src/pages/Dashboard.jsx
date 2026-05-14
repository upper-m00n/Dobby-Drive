import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import AppLayout from '../components/layout/AppLayout';
import FolderCard from '../components/folder/FolderCard';
import CreateFolderModal from '../components/folder/CreateFolderModal';
import EmptyState from '../components/ui/EmptyState';
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

  const headerComponent = (
    <Header
      title="My Drive"
      search={search}
      onSearchChange={setSearch}
      sort={sort}
      onSortChange={setSort}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onCreateClick={() => setShowCreate(true)}
    />
  );

  const sidebarComponent = (
    <Sidebar currentFolderId={null} onCreateFolder={() => setShowCreate(true)} />
  );

  return (
    <>
      <AppLayout sidebar={sidebarComponent} header={headerComponent}>
        <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto min-h-full">
          {/* Folders Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full"
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 shadow-inner"
                whileHover={{ scale: 1.05 }}
              >
                <Folder className="w-5 h-5 text-indigo-400" />
              </motion.div>
              <div className="flex-1">
                <h2 className="text-xl md:text-[22px] font-semibold text-white tracking-tight">
                  Your Folders
                </h2>
                {!foldersLoading && (
                  <p className="text-sm text-zinc-400 mt-0.5">
                    {filteredFolders.length} folder{filteredFolders.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Folders grid/list */}
            {foldersLoading ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 md:gap-6'
                  : 'flex flex-col gap-3'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <FolderSkeleton key={i} />
                ))}
              </div>
            ) : filteredFolders.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center pb-20">
                <EmptyState
                  icon={<Folder className="w-12 h-12 text-zinc-500" />}
                  title={search ? 'No folders found' : 'Your drive is empty'}
                  description={search
                    ? 'Try adjusting your search query.'
                    : 'Create your first folder to organize your files and get started.'}
                  action={
                    !search && (
                      <motion.button
                        onClick={() => setShowCreate(true)}
                        className="btn-primary gap-2 mt-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Folder className="w-4 h-4" />
                        Create First Folder
                      </motion.button>
                    )
                  }
                  variant="large"
                />
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
                transition={{ duration: 0.4 }}
              >
                {filteredFolders.map((f, i) => (
                  <motion.div
                    key={f._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <FolderCard
                      folder={f}
                      currentFolderId={null}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        </div>
      </AppLayout>

      {/* Modals */}
      <CreateFolderModal isOpen={showCreate} onClose={() => setShowCreate(false)} parentFolderId={null} />
    </>
  );
}
