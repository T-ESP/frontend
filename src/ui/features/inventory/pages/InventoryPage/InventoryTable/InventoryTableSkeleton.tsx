export function InventoryTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-card border rounded-xl border-border animate-pulse">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-9 rounded-lg bg-muted" />
          <div className="h-9 rounded-lg w-28 bg-muted" />
          <div className="h-9 rounded-lg w-28 bg-muted" />
        </div>
      </div>

      <div className="overflow-hidden bg-card border rounded-xl border-border">
        <div className="divide-y divide-border">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="w-1/3 h-4 rounded bg-muted" />
                <div className="w-1/4 h-3 rounded bg-muted" />
              </div>
              <div className="w-20 h-4 rounded bg-muted" />
              <div className="w-16 h-4 rounded bg-muted" />
              <div className="w-24 h-7 rounded-full bg-muted" />
              <div className="w-24 h-7 rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
