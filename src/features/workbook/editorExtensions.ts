import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import Image from '@tiptap/extension-image';
import type { AnyExtension } from '@tiptap/react';
import { editor as editorConfig, labels } from '@/config';

/**
 * The editor's schema. StarterKit (v3) already bundles paragraphs, headings,
 * bold/italic/underline, bullet/numbered lists, links, and undo/redo, so the
 * toolbar's full feature set maps onto built-in commands. We narrow headings to
 * the configured levels, add image nodes, and a placeholder for the empty state.
 *
 * Returned as a factory because Tiptap extensions are stateful and must not be
 * shared across editor instances.
 */
export function createWorkbookExtensions(): AnyExtension[] {
  return [
    StarterKit.configure({
      heading: { levels: [...editorConfig.headingLevels] },
      link: {
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      },
    }),
    Image.configure({ inline: false, allowBase64: false }),
    Placeholder.configure({ placeholder: labels.states.emptyWorkbook }),
  ];
}
