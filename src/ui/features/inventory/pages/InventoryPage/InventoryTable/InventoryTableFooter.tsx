export function InventoryTableFooter() {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-gray-50/30">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">1-5</span> of <span className="font-semibold text-foreground">368</span> products
      </p>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <button className="px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary border border-primary rounded-lg hover:bg-primary/90 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

