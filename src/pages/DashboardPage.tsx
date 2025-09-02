export default function DashboardPage() {


  return (
    <div className="w-full h-auto md:h-screen p-2">
      <div className="grid grid-cols-9 grid-rows-9 gap-2 w-full h-full">
        {Array.from({ length: 81 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
