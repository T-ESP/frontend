export type RouteMeta = {
  path: string;
  label: string;
  page: string;
  icon?: string;
  restricted?: boolean;
  roles?: string[];
  layout?: 'app' | 'auth';
  hiddenInMenu?: boolean;
};