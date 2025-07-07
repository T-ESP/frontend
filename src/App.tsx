import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes/routeConfig';

export default function App() {
  const routing = useRoutes(routes);

  return (
    <Suspense fallback={<div className="p-8">Chargement...</div>}>
      {routing}
    </Suspense>
  );
}