import type { RouteObject } from 'react-router-dom';
import { ROUTES } from './metaRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '@/ui/components/layouts/AuthLayout';
import { HomeLayout } from '@/ui/components/layouts/HomeLayout';
import { AppLayout } from '@/ui/components/layouts/AppLayout';
import { PAGES } from '@/ui/routing/pages';

export const routes: RouteObject[] = Object.values(ROUTES).map((route) => {

  const Page = PAGES[route.page as keyof typeof PAGES];

  const Layout =
    route.layout === 'auth'
      ? AuthLayout
      : route.layout === 'home'
        ? HomeLayout
        : route.layout === 'none'
          ? ({ children }: { children: React.ReactNode }) => <>{children}</>
          : AppLayout;


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