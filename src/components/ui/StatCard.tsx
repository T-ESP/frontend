type Props = {
  title: string;
  value: string;
  growth: string;
  status: "up" | "down";
  description: string;
};

export default function StatCard({ title, value, growth, status, description }: Props) {
  const growthColor = status === "up" ? "text-green-500" : "text-red-500";
  const bgIcon = status === "up" ? "bg-green-100" : "bg-red-100";
  const icon = status === "up" ? "↑" : "↓";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h3>
      <div className="flex items-center gap-2 mt-2">
        <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${bgIcon}`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${growthColor}`}>{growth}</span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
    </div>
  );
}
