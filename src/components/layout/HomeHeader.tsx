export function HomeHeader() {
  return (
    <header className="flex items-center justify-between w-full">
      <h1 className="text-xl font-semibold text-center mb-4">Bienvenue</h1>
      <div className="flex items-center gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Connexion</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Inscription</button>
      </div>
    </header>
  );
}