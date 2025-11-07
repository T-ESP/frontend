const mockData = [
  { id: 1, date: "2024-10-02", product: "Widget A", client: "Acme Inc.", quantity: 3, amount: "€150" },
  { id: 2, date: "2024-10-03", product: "Gadget B", client: "Beta Co.", quantity: 1, amount: "€90" },
  { id: 3, date: "2024-10-04", product: "Widget C", client: "Gamma LLC", quantity: 2, amount: "€120" },
];

export default function SalesTable() {
  return (
    <div className="bg-white dark:bg-[#1f1f2e] p-6 rounded-lg shadow">
      <p className="mb-2 text-gray-600 text-sm">Recent Sales</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="py-2">Date</th>
            <th>Product</th>
            <th>Client</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((sale) => (
            <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-[#2c2c3e]">
              <td className="py-2">{sale.date}</td>
              <td>{sale.product}</td>
              <td>{sale.client}</td>
              <td>{sale.quantity}</td>
              <td>{sale.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
