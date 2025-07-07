import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from './metaRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';

export const routes: RouteObject[] = Object.values(ROUTES).map((route) => {
  const Page = lazy(() => import(`@/pages/${route.label}Page`));

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
