import { motion } from 'framer-motion';
import { Search, LayoutGrid, List, Plus, Home } from 'lucide-react';

export default function Header({ 
  title, 
  search, 
  onSearchChange, 
  sort, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  onCreateClick,
  breadcrumb = null 
}) {
  return (
    <div className="w-full h-full px-6 md:px-10 flex items-center justify-between gap-6">
      {/* Left: Breadcrumb / Title */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        {breadcrumb ? (
          breadcrumb
        ) : (
          <>
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex-shrink-0 shadow-inner">
              <Home className="w-[18px] h-[18px] text-indigo-400" />
            </div>
            <h1 className="text-[18px] font-bold text-white tracking-tight truncate">
              {title || 'My Drive'}
            </h1>
          </>
        )}
      </div>

      {/* Center: Search and Controls */}
      <div className="hidden sm:flex items-center gap-4 flex-1 max-w-xl">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search files, folders..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-[14px] font-medium outline-none transition-all bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/[0.05] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 shadow-inner"
          />
        </div>

        {/* Sort */}
        {onSortChange && (
          <motion.select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-10 pl-4 pr-10 rounded-xl text-[14px] font-medium outline-none transition-all bg-white/[0.03] border border-white/10 text-zinc-200 cursor-pointer appearance-none focus:bg-white/[0.05] focus:border-indigo-500/50"
            whileHover={{ scale: 1.02 }}
            style={{
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
            }}
          >
            <option value="newest" className="bg-dark-900">Newest First</option>
            <option value="name" className="bg-dark-900">Name A-Z</option>
            <option value="size" className="bg-dark-900">Size</option>
          </motion.select>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* View toggle */}
        {onViewModeChange && (
          <motion.div 
            className="hidden md:flex rounded-xl p-1 bg-white/[0.03] border border-white/10 gap-1"
          >
            {[
              { mode: 'grid', Icon: LayoutGrid },
              { mode: 'list', Icon: List }
            ].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === mode
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </motion.div>
        )}

        {/* Create button */}
        {onCreateClick && (
          <motion.button
            onClick={onCreateClick}
            className="h-10 px-4 sm:px-5 flex items-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">New Folder</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
