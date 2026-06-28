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
  /** Copy for the projects list page. */
  projects: {
    title: 'Projects',
    subtitle: 'Open a project to start writing in its workbook.',
    createdLabel: 'Created',
    errorTitle: 'Couldn’t load your projects',
    openWorkbookFor: (name: string) => `Open the ${name} workbook`,
  },
  /** Copy for the workbook page surrounding the editor. */
  workbook: {
    title: 'Workbook',
    subtitle: 'Your notes autosave as you type.',
    loadErrorTitle: 'Couldn’t load this workbook',
  },
  /** Copy for the rich-text workbook editor and its toolbar. */
  editor: {
    /** Visible/labelling text for each formatting control. */
    actions: {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      heading: 'Heading',
      bulletList: 'Bullet list',
      numberedList: 'Numbered list',
      uploadImage: 'Upload image',
      uploadPdf: 'Upload PDF',
      undo: 'Undo',
      redo: 'Redo',
      more: 'More formatting',
    },
    /** Block-type names shown in the heading menu. */
    blockTypes: {
      paragraph: 'Paragraph',
      heading: (level: number) => `Heading ${level}`,
    },
    /** Section headings inside the overflow menu. */
    groups: {
      lists: 'Lists',
      insert: 'Insert',
    },
    /** Feedback shown while/after attaching a file. */
    upload: {
      uploading: 'Uploading…',
      uploadingFile: (name: string) => `Uploading ${name}…`,
      progressTitle: 'Uploading attachments',
      success: 'File attached',
      failedTitle: 'Upload failed',
      tooLarge: (limit: string) => `That file is larger than the ${limit} limit.`,
      unsupported: 'That file type isn’t supported.',
      generic: 'We couldn’t attach that file. Please try again.',
      /** Drag-and-drop overlay copy. */
      dropTitle: 'Drop to attach',
      dropHint: (limit: string) => `Images and PDFs up to ${limit}`,
    },
    /** Copy for the embedded PDF attachment node. */
    pdf: {
      openInNewTab: 'Open PDF in a new tab',
      previewLabel: (name: string) => `PDF preview: ${name}`,
      untitled: 'PDF document',
    },
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
    editorRegion: 'Workbook editor',
    formattingToolbar: 'Formatting',
    headingMenu: 'Text style',
    moreActions: 'More formatting options',
    saveStatus: 'Save status',
    dropZone: 'Drop images or PDFs to attach them',
    uploadProgress: 'Upload progress',
  },
} as const;

export type Labels = typeof labels;
