export type RouteMeta = {
  path: string;
  label: string;
  icon?: string;
  restricted?: boolean;
  roles?: string[];
  layout?: 'app' | 'auth';
  hiddenInMenu?: boolean;
};