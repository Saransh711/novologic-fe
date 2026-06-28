'use client';

import { useRef, type ChangeEvent } from 'react';
import { useEditorState, type Editor } from '@tiptap/react';
import {
  Bold,
  ChevronDown,
  FileUp,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  MoreHorizontal,
  Pilcrow,
  Redo2,
  Underline,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import { editor as editorConfig, imageAccept, labels, pdfAccept, type HeadingLevel } from '@/config';
import { cn } from '@/lib/utils/cn';
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  Tooltip,
} from '@/components/ui';
import { useBreakpoint } from '@/lib/hooks/useMediaQuery';
import type { WorkbookUploadHandlers } from './types';

const HEADING_ICONS: Record<number, LucideIcon> = {
  1: Heading1,
  2: Heading2,
  3: Heading3,
};

export interface WorkbookToolbarProps {
  editor: Editor;
  uploads: WorkbookUploadHandlers;
}

export function WorkbookToolbar({ editor, uploads }: WorkbookToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const showInline = useBreakpoint('md');

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
      headingLevel:
        editorConfig.headingLevels.find((level) => editor.isActive('heading', { level })) ?? null,
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const textMarks = [
    state.bold && 'bold',
    state.italic && 'italic',
    state.underline && 'underline',
  ].filter(Boolean) as string[];
  const listMarks = [
    state.bulletList && 'bulletList',
    state.orderedList && 'orderedList',
  ].filter(Boolean) as string[];

  const pickFile =
    (handler: (file: File) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handler(file);
      event.target.value = '';
    };

  const openImagePicker = () => imageInputRef.current?.click();
  const openPdfPicker = () => pdfInputRef.current?.click();

  return (
    <>
      <Toolbar aria-label={labels.a11y.formattingToolbar}>
        <ToolbarToggleGroup type="multiple" value={textMarks} onValueChange={() => {}}>
          <ToggleAction
            value="bold"
            label={labels.editor.actions.bold}
            icon={Bold}
            pressed={state.bold}
            onToggle={() => editor.chain().focus().toggleBold().run()}
          />
          <ToggleAction
            value="italic"
            label={labels.editor.actions.italic}
            icon={Italic}
            pressed={state.italic}
            onToggle={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToggleAction
            value="underline"
            label={labels.editor.actions.underline}
            icon={Underline}
            pressed={state.underline}
            onToggle={() => editor.chain().focus().toggleUnderline().run()}
          />
        </ToolbarToggleGroup>

        <ToolbarSeparator />

        <HeadingMenu editor={editor} activeLevel={state.headingLevel} />

        {showInline ? (
          <>
            <ToolbarSeparator />
            <ToolbarToggleGroup type="multiple" value={listMarks} onValueChange={() => {}}>
              <ToggleAction
                value="bulletList"
                label={labels.editor.actions.bulletList}
                icon={List}
                pressed={state.bulletList}
                onToggle={() => editor.chain().focus().toggleBulletList().run()}
              />
              <ToggleAction
                value="orderedList"
                label={labels.editor.actions.numberedList}
                icon={ListOrdered}
                pressed={state.orderedList}
                onToggle={() => editor.chain().focus().toggleOrderedList().run()}
              />
            </ToolbarToggleGroup>

            <ToolbarSeparator />

            <ActionButton
              label={labels.editor.actions.uploadImage}
              icon={ImagePlus}
              onTrigger={openImagePicker}
            />
            <ActionButton
              label={labels.editor.actions.uploadPdf}
              icon={FileUp}
              onTrigger={openPdfPicker}
            />
          </>
        ) : (
          <>
            <ToolbarSeparator />
            <OverflowMenu
              editor={editor}
              listState={{ bulletList: state.bulletList, orderedList: state.orderedList }}
              onUploadImage={openImagePicker}
              onUploadPdf={openPdfPicker}
            />
          </>
        )}

        <div className="ml-auto flex items-center gap-1">
          <ToolbarSeparator />
          <ActionButton
            label={labels.editor.actions.undo}
            icon={Undo2}
            disabled={!state.canUndo}
            onTrigger={() => editor.chain().focus().undo().run()}
          />
          <ActionButton
            label={labels.editor.actions.redo}
            icon={Redo2}
            disabled={!state.canRedo}
            onTrigger={() => editor.chain().focus().redo().run()}
          />
        </div>
      </Toolbar>

      <input
        ref={imageInputRef}
        type="file"
        accept={imageAccept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={pickFile(uploads.uploadImage)}
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept={pdfAccept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={pickFile(uploads.uploadPdf)}
      />
    </>
  );
}

interface ToggleActionProps {
  value: string;
  label: string;
  icon: LucideIcon;
  pressed: boolean;
  onToggle: () => void;
}

function ToggleAction({ value, label, icon: Icon, pressed, onToggle }: ToggleActionProps) {
  return (
    <Tooltip content={label}>
      <ToolbarToggleItem
        value={value}
        aria-label={label}
        aria-pressed={pressed}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onToggle}
        className={cn(pressed && 'text-primary')}
      >
        <Icon aria-hidden />
      </ToolbarToggleItem>
    </Tooltip>
  );
}

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  onTrigger: () => void;
}

function ActionButton({ label, icon: Icon, disabled, onTrigger }: ActionButtonProps) {
  return (
    <Tooltip content={label}>
      <ToolbarButton
        aria-label={label}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onTrigger}
      >
        <Icon aria-hidden />
      </ToolbarButton>
    </Tooltip>
  );
}

interface HeadingMenuProps {
  editor: Editor;
  activeLevel: HeadingLevel | null;
}

function HeadingMenu({ editor, activeLevel }: HeadingMenuProps) {
  const currentLabel = activeLevel
    ? labels.editor.blockTypes.heading(activeLevel)
    : labels.editor.blockTypes.paragraph;

  return (
    <Menu>
      <MenuTrigger asChild>
        <ToolbarButton
          aria-label={`${labels.a11y.headingMenu}: ${currentLabel}`}
          className="gap-1.5 px-2.5"
        >
          <Heading aria-hidden />
          <span className="hidden text-sm font-medium sm:inline">{currentLabel}</span>
          <ChevronDown className="opacity-70" aria-hidden />
        </ToolbarButton>
      </MenuTrigger>
      <MenuContent aria-label={labels.a11y.headingMenu}>
        <MenuCheckboxItem
          checked={activeLevel === null}
          onSelect={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow aria-hidden />
          {labels.editor.blockTypes.paragraph}
        </MenuCheckboxItem>
        <MenuSeparator />
        {editorConfig.headingLevels.map((level) => {
          const Icon = HEADING_ICONS[level] ?? Heading;
          return (
            <MenuCheckboxItem
              key={level}
              checked={activeLevel === level}
              onSelect={() => editor.chain().focus().setHeading({ level }).run()}
            >
              <Icon aria-hidden />
              {labels.editor.blockTypes.heading(level)}
            </MenuCheckboxItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
}

interface OverflowMenuProps {
  editor: Editor;
  listState: { bulletList: boolean; orderedList: boolean };
  onUploadImage: () => void;
  onUploadPdf: () => void;
}

function OverflowMenu({ editor, listState, onUploadImage, onUploadPdf }: OverflowMenuProps) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <ToolbarButton aria-label={labels.a11y.moreActions}>
          <MoreHorizontal aria-hidden />
        </ToolbarButton>
      </MenuTrigger>
      <MenuContent align="start" aria-label={labels.a11y.moreActions}>
        <MenuLabel>{labels.editor.groups.lists}</MenuLabel>
        <MenuCheckboxItem
          checked={listState.bulletList}
          onSelect={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <List aria-hidden />
          {labels.editor.actions.bulletList}
        </MenuCheckboxItem>
        <MenuCheckboxItem
          checked={listState.orderedList}
          onSelect={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <ListOrdered aria-hidden />
          {labels.editor.actions.numberedList}
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuLabel>{labels.editor.groups.insert}</MenuLabel>
        <MenuItem onSelect={onUploadImage}>
          <ImagePlus aria-hidden />
          {labels.editor.actions.uploadImage}
        </MenuItem>
        <MenuItem onSelect={onUploadPdf}>
          <FileUp aria-hidden />
          {labels.editor.actions.uploadPdf}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
