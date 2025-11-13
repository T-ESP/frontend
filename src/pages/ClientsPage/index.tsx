import { FiMessageSquare, FiUserPlus } from "react-icons/fi";

const mockClients = [
  {
    id: 1,
    name: "Jason Price",
    email: "kulhman.jeremy@yahoo.com",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 2,
    name: "Duane Dean",
    email: "rusty.bednar@wind.biz",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 3,
    name: "Jonathan Barker",
    email: "cora.haley@quinn.biz",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
  },
  {
    id: 4,
    name: "Rosie Glover",
    email: "lockman.manuj@gmail.com",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  },
  {
    id: 5,
    name: "Patrick Greer",
    email: "peralta.ehrman@wiso.net",
    avatar: "https://randomuser.me/api/portraits/men/38.jpg",
  },
  {
    id: 6,
    name: "Darrell Ortega",
    email: "chaya.shield@emjay.info",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
];

export default function ClientsPage() {
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Clients</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all">
          <FiUserPlus className="text-lg" />
          Add New Client
        </button>
      </div>

      {/* Client Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col items-center text-center"
          >
            <img
              src={client.avatar}
              alt={client.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{client.email}</p>
            <button className="mt-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all">
              <FiMessageSquare className="text-lg" />
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
