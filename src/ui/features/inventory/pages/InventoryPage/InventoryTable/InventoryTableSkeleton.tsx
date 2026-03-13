export function InventoryTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            <div className="h-10 bg-gray-200 rounded-lg w-32" />
            <div className="h-10 bg-gray-200 rounded-lg w-32" />
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center gap-4 animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-lg" />

            {/* Info Skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>

            {/* Right Section Skeleton */}
            <div className="flex items-center gap-6 ml-auto">
              {/* Status Badge */}
              <div className="w-24 h-8 bg-gray-200 rounded-full" />

              {/* Stock Controls */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="w-12 h-8 bg-gray-200 rounded" />
                <div className="w-8 h-8 bg-gray-200 rounded" />
              </div>

              {/* Price */}
              <div className="w-20 h-6 bg-gray-200 rounded" />

              {/* Actions */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
