import { motion } from 'framer-motion';

export default function AppLayout({ sidebar, header, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/[0.08] blur-[120px]" />
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-[280px] md:flex-col md:shrink-0 md:fixed md:inset-y-0 md:left-0 md:z-30 border-r border-white/5 bg-dark-950/60 backdrop-blur-2xl">
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-[280px] z-10 relative">
        {/* Header */}
        <header className="sticky top-0 z-20 h-[72px] flex items-center shrink-0 border-b border-white/5 bg-dark-950/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-dark-950/40">
          {header}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
