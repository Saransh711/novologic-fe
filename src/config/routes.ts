/**
 * Single source of truth for in-app navigation paths. Never hard-code a URL
 * string in a component — compose links from here.
 */
export const routes = {
  home: '/',
  projects: '/projects',
  project: (projectId: string) => `/projects/${projectId}`,
  workbook: (projectId: string) => `/projects/${projectId}/workbook`,
} as const;

export type Routes = typeof routes;
