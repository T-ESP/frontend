import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { routes } from './app/routes/routeConfig';

export default function App() {
  const routing = useRoutes(routes);

  return (
    <Suspense
    // fallback={<div className="p-8">Chargement...</div>}
    >
      <ToastProvider >
        {routing}
      </ToastProvider>
    </Suspense>
  );
}