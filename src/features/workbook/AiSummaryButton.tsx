'use client';

import { useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { editor as editorConfig, labels } from '@/config';
import { Button, useToast } from '@/components/ui';
import { useAiSummary } from './useAiSummary';

export interface AiSummaryButtonProps {
  editor: Editor | null;
}

const SUMMARY_HEADING_LEVEL = editorConfig.headingLevels[1] ?? editorConfig.headingLevels[0];

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
