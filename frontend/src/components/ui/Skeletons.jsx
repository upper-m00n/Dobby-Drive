export function FolderSkeleton() {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="skeleton w-12 h-12 rounded-xl mb-3" />
      <div className="skeleton h-3.5 w-3/4 mb-2 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
}

export function ImageSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="skeleton aspect-square" />
      <div className="p-3">
        <div className="skeleton h-3 w-3/4 mb-1 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
