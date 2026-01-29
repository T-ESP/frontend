interface PageActionsProps {
  onAddProduct: () => void;
}

export function PageActions({ onAddProduct }: PageActionsProps) {
  return (
    <div className="flex gap-3">
      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
        Export
      </button>
      <button
        onClick={onAddProduct}
        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg border border-purple-600 transition-colors hover:bg-purple-700"
      >
        Add Product
      </button>
    </div>
  );
}

