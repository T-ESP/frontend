type Props = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white dark:bg-[#1f1f2e] p-4 rounded-lg shadow hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl font-bold mt-2">{value}</h3>
    </div>
  );
}
