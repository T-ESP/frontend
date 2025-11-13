const mockData = [
  {
    id: 1,
    product: "Apple Watch Series 9",
    location: "6096 Majoblanke Landing",
    date: "12.09.2019",
    time: "12:53 PM",
    quantity: 423,
    amount: "$34,295",
    status: "Delivered",
    avatar: "https://i.pravatar.cc/40?img=1"
  },
  {
    id: 2,
    product: "MacBook Pro 16\"",
    location: "1234 Tech Avenue",
    date: "15.09.2019",
    time: "03:22 PM",
    quantity: 156,
    amount: "$62,180",
    status: "Pending",
    avatar: "https://i.pravatar.cc/40?img=2"
  },
  {
    id: 3,
    product: "iPhone 15 Pro",
    location: "8901 Innovation Street",
    date: "18.09.2019",
    time: "09:15 AM",
    quantity: 892,
    amount: "$98,120",
    status: "Delivered",
    avatar: "https://i.pravatar.cc/40?img=3"
  },
  {
    id: 4,
    product: "AirPods Pro",
    location: "5432 Commerce Blvd",
    date: "20.09.2019",
    time: "11:40 AM",
    quantity: 1240,
    amount: "$28,960",
    status: "Cancelled",
    avatar: "https://i.pravatar.cc/40?img=4"
  },
  {
    id: 5,
    product: "iPad Air",
    location: "7890 Market Plaza",
    date: "22.09.2019",
    time: "02:18 PM",
    quantity: 567,
    amount: "$45,360",
    status: "Delivered",
    avatar: "https://i.pravatar.cc/40?img=5"
  }
];

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200"
};

export default function SalesTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Deals Details</h3>
          <p className="text-sm text-gray-500 mt-0.5">Recent transactions and orders</p>
        </div>
        <select className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-300">
          <option>October</option>
          <option>September</option>
          <option>August</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Name
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockData.map((sale, index) => (
              <tr 
                key={sale.id} 
                className="hover:bg-purple-50/30 transition-colors duration-150 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={sale.avatar} 
                        alt={sale.product} 
                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" 
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      {sale.product}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{sale.location}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">{sale.date}</span>
                    <span className="text-xs text-gray-500">{sale.time}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 text-gray-700 font-medium">
                    {sale.quantity.toLocaleString()}
                    <span className="text-xs text-gray-400">pcs</span>
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900 font-semibold text-base">
                    {sale.amount}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[sale.status as keyof typeof statusStyles]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      sale.status === 'Delivered' ? 'bg-emerald-500' : 
                      sale.status === 'Pending' ? 'bg-amber-500' : 
                      'bg-rose-500'
                    }`}></span>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">1-5</span> of <span className="font-semibold text-gray-900">124</span> deals
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
