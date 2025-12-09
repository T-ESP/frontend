import { FiUsers, FiTrendingUp, FiAward, FiTarget } from "react-icons/fi";

const teamStats = [
  { label: "Total Members", value: "24", icon: FiUsers, color: "purple" },
  { label: "Active Projects", value: "8", icon: FiTarget, color: "blue" },
  { label: "Completed Tasks", value: "156", icon: FiAward, color: "emerald" },
  { label: "Performance", value: "94%", icon: FiTrendingUp, color: "amber" },
];

const teams = [
  { id: 1, name: "Sales Team", members: 8, lead: "Bob Dubois", performance: 96, color: "blue" },
  { id: 2, name: "Operations Team", members: 6, lead: "Emma Moreau", performance: 92, color: "purple" },
  { id: 3, name: "Warehouse Team", members: 5, lead: "David Petit", performance: 88, color: "emerald" },
  { id: 4, name: "Management Team", members: 5, lead: "Alice Martin", performance: 98, color: "amber" },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Team Overview</h3>
          <p className="text-sm text-gray-500 mt-0.5">Monitor team performance and collaboration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Teams</h3>
        </div>
        <div className="p-6 space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${team.color}-100 flex items-center justify-center`}>
                    <FiUsers className={`w-6 h-6 text-${team.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{team.name}</h4>
                    <p className="text-sm text-gray-500">Lead by {team.lead}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{team.members}</p>
                    <p className="text-xs text-gray-500">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{team.performance}%</p>
                    <p className="text-xs text-gray-500">Performance</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                    View Team
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


