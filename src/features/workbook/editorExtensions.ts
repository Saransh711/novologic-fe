import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import Image from '@tiptap/extension-image';
import type { AnyExtension } from '@tiptap/react';
import { editor as editorConfig, labels } from '@/config';
import { PdfEmbed } from './extensions/pdfEmbed';

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
    PdfEmbed,
    Placeholder.configure({ placeholder: labels.states.emptyWorkbook }),
  ];
}
