export function HomeHeader() {
  return (
    <header className="bg-white shadow-md flex py-4 px-2">
      <p className="text-primary font-bold text-xl">StockS</p>
      <div className="flex items-center gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Connexion</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Inscription</button>
      </div>
    </header>
  );
}