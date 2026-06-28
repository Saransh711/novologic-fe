/**
 * App-wide identity and user-facing copy. All labels live here so wording can be
 * changed (or later localized) without touching components.
 */
export const app = {
  name: 'Online Workbook',
  shortName: 'Workbook',
  description:
    'A focused, autosaving rich-text workbook for capturing and organising your project notes.',
  tagline: 'Write, organise, and never lose a thought.',
} as const;

export const labels = {
  actions: {
    create: 'Create',
    save: 'Save',
    cancel: 'Cancel',
    retry: 'Try again',
    openWorkbook: 'Open workbook',
    newProject: 'New project',
  },
  nav: {
    projects: 'Projects',
    workbook: 'Workbook',
  },
  user: {
    panelTitle: 'Your information',
    fields: {
      name: 'Name',
      email: 'Email',
      address: 'Address',
      phone: 'Phone',
    },
    errorTitle: 'Couldn’t load your information',
    empty: 'No user information available yet.',
  },
  states: {
    loading: 'Loading…',
    saving: 'Saving…',
    saved: 'All changes saved',
    saveError: 'Could not save your changes',
    genericError: 'Something went wrong.',
    emptyProjects: 'No projects yet. Create your first one to get started.',
    emptyWorkbook: 'This workbook is empty. Start typing to add content.',
  },
  /**
   * Accessible names for icon-only controls and assistive-tech landmarks. These
   * are never shown visually but are essential for screen-reader users.
   */
  a11y: {
    skipToContent: 'Skip to content',
    primaryNav: 'Primary',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    closeDialog: 'Close',
    dismissNotification: 'Dismiss notification',
    notifications: 'Notifications',
    home: 'Go to home',
    toolbar: 'Toolbar',
  },
} as const;

export type Labels = typeof labels;
