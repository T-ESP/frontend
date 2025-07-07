import type { RouteObject } from 'react-router-dom';
import { ROUTES } from './metaRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PAGES } from '@/pages/pages';


export const routes: RouteObject[] = Object.values(ROUTES).map((route) => {

  const Page = PAGES[route.page as keyof typeof PAGES];

  const Layout = route.layout === 'auth' ? AuthLayout : AppLayout;

  const element = route.restricted
    ? (
      <ProtectedRoute roles={route.roles}>
        <Layout>
          <Page />
        </Layout>
      </ProtectedRoute>
    )
    : (
      <Layout>
        <Page />
      </Layout>
    );

  return {
    path: route.path,
    element,
  } satisfies RouteObject;
});
