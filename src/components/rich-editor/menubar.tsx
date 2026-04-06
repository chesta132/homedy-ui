import { Editor, useEditorState, type ChainedCommands } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  CornerUpLeft,
  CornerUpRight,
  Pilcrow,
  RemoveFormatting,
} from "lucide-react";
import { menuBarStateSelector } from "./state";
import { memo } from "react";

const Divider = () => <div className="mx-1 lg:mx-0 lg:my-1 my-0 h-4 w-px lg:h-px lg:w-4 shrink-0 bg-border-sub" />;

interface TbBtnProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

const TbBtn = memo(({ onClick, active, disabled, title, children }: TbBtnProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={[
      "flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-sm px-1.5",
      "text-xs font-medium transition-colors duration-150",
      "disabled:cursor-default disabled:text-muted",
      active ? "bg-active text-fg" : "text-subtle hover:bg-hover hover:text-fg disabled:hover:bg-transparent",
    ].join(" ")}
  >
    {children}
  </button>
));

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor || !editorState) return null;

  const chain = (action: (chain: ChainedCommands) => ChainedCommands) => action(editor.chain()).run();

  return (
    <div
      className="flex lg:flex-col items-center gap-3 border-b lg:border-b-none lg:border-r border-border bg-surface px-2 py-1.5 overflow-y-auto overflow-x-hidden scrollbar-left"
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Text formatting */}
      <TbBtn onClick={() => chain((c) => c.toggleBold())} active={editorState.isBold} disabled={!editorState.canBold} title="Bold">
        <Bold size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.toggleItalic())} active={editorState.isItalic} disabled={!editorState.canItalic} title="Italic">
        <Italic size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.toggleStrike())} active={editorState.isStrike} disabled={!editorState.canStrike} title="Strikethrough">
        <Strikethrough size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.toggleCode())} active={editorState.isCode} disabled={!editorState.canCode} title="Inline Code">
        <Code size={14} />
      </TbBtn>

      <Divider />

      {/* Clear */}
      <TbBtn onClick={() => chain((c) => c.unsetAllMarks())} title="Clear marks">
        <RemoveFormatting size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.clearNodes())} title="Clear nodes">
        <Pilcrow size={14} />
      </TbBtn>

      <Divider />

      {/* Block types */}
      <TbBtn onClick={() => chain((c) => c.setParagraph())} active={editorState.isParagraph} title="Paragraph">
        <span className="text-[11px] font-medium">¶</span>
      </TbBtn>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <TbBtn
          key={level}
          onClick={() => chain((c) => c.toggleHeading({ level }))}
          active={editorState[`isHeading${level}` as keyof typeof editorState] as boolean}
          title={`Heading ${level}`}
        >
          <span className="text-[11px] font-medium">H{level}</span>
        </TbBtn>
      ))}

      <Divider />

      {/* Lists & blocks */}
      <TbBtn onClick={() => chain((c) => c.toggleBulletList())} active={editorState.isBulletList} title="Bullet list">
        <List size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.toggleOrderedList())} active={editorState.isOrderedList} title="Ordered list">
        <ListOrdered size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.toggleCodeBlock())} active={editorState.isCodeBlock} title="Code block">
        <Code2 size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.toggleBlockquote())} active={editorState.isBlockquote} title="Blockquote">
        <Quote size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.setHorizontalRule())} title="Horizontal rule">
        <Minus size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.setHardBreak())} title="Hard break">
        <span className="text-[11px] font-medium">↵</span>
      </TbBtn>

      <Divider />

      {/* History */}
      <TbBtn onClick={() => chain((c) => c.undo())} disabled={!editorState.canUndo} title="Undo">
        <CornerUpLeft size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain((c) => c.redo())} disabled={!editorState.canRedo} title="Redo">
        <CornerUpRight size={14} />
      </TbBtn>
    </div>
  );
};
