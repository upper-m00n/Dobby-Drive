export function FolderSkeleton() {
  return (
    <div className="rounded-[24px] p-6 bg-white/[0.02] border border-white/5 flex flex-col">
      <div className="w-14 h-14 rounded-2xl mb-5 bg-white/5 animate-pulse" />
      <div className="h-4 w-3/4 mb-2.5 rounded bg-white/5 animate-pulse" />
      <div className="h-3.5 w-1/2 rounded bg-white/5 animate-pulse mt-auto" />
    </div>
  );
}

export function ImageSkeleton() {
  return (
    <div className="rounded-[20px] overflow-hidden bg-white/[0.02] border border-white/5 flex flex-col">
      <div className="aspect-square bg-white/5 animate-pulse" />
      <div className="p-4">
        <div className="h-3 w-3/4 mb-2 rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
