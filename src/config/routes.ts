
export const routes = {
  home: '/',
  login: '/login',
  projects: '/projects',
  project: (projectId: string) => `/projects/${projectId}`,
  workbook: (projectId: string) => `/projects/${projectId}/workbook`,
} as const;

export type Routes = typeof routes;
