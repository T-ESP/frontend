interface SalesTableBodyProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export function SalesTableBody({ data }: SalesTableBodyProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <tbody className="divide-y divide-gray-100">
      {data.length === 0 ? (
        <tr>
          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
            No sales data available
          </td>
        </tr>
      ) : (
        data.map((row, index) => (
          <tr key={row.date} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
              {formatDate(row.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {row.orders}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
              {formatCurrency(row.revenue)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {row.orders > 0 ? formatCurrency(row.revenue / row.orders) : '-'}
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}

