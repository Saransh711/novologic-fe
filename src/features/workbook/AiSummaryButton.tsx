'use client';

import { useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { editor as editorConfig, labels } from '@/config';
import { Button, useToast } from '@/components/ui';
import { useAiSummary } from './useAiSummary';

export interface AiSummaryButtonProps {
  /** The live editor; `null` until it has hydrated. */
  editor: Editor | null;
}

/** Heading level used for the inserted summary block. */
const SUMMARY_HEADING_LEVEL = editorConfig.headingLevels[1] ?? editorConfig.headingLevels[0];

/**
 * Generates an AI summary from the mocked endpoint and appends it — under an
 * "AI Summary" heading — to the end of the workbook. The insertion emits an
 * editor update, so the existing autosave persists it automatically. Surfaces
 * the request via a loading state and reports failures with a toast.
 */
export function AiSummaryButton({ editor }: AiSummaryButtonProps) {
  const { generate, isGenerating } = useAiSummary();
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    if (!editor) return;
    try {
      const summary = await generate();
      const endPos = editor.state.doc.content.size;
      editor
        .chain()
        .focus()
        .insertContentAt(endPos, [
          {
            type: 'heading',
            attrs: { level: SUMMARY_HEADING_LEVEL },
            content: [{ type: 'text', text: labels.workbook.aiSummary.heading }],
          },
          { type: 'paragraph', content: [{ type: 'text', text: summary }] },
        ])
        .run();
      toast({
        variant: 'success',
        title: labels.workbook.aiSummary.successTitle,
        description: labels.workbook.aiSummary.successBody,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      toast({
        variant: 'danger',
        title: labels.workbook.aiSummary.errorTitle,
        description: labels.workbook.aiSummary.errorBody,
      });
    }
  }, [editor, generate, toast]);

  return (
    <Button
      variant="secondary"
      size="sm"
      isLoading={isGenerating}
      disabled={!editor}
      leadingIcon={<Sparkles className="h-4 w-4" aria-hidden />}
      onClick={() => void handleGenerate()}
    >
      {isGenerating ? labels.workbook.aiSummary.generating : labels.workbook.aiSummary.generate}
    </Button>
  );
}
