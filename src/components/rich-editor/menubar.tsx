import { Editor, useEditorState } from "@tiptap/react";
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

const Divider = () => <div className="mx-1 h-4 w-px shrink-0 bg-border-sub" />;

interface TbBtnProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

const TbBtn = ({ onClick, active, disabled, title, children }: TbBtnProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={[
      "flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-[--radius-sm] px-1.5",
      "text-xs font-medium transition-colors duration-150",
      "disabled:cursor-default disabled:text-muted",
      active ? "bg-active text-fg" : "text-subtle hover:bg-hover hover:text-fg disabled:hover:bg-transparent",
    ].join(" ")}
  >
    {children}
  </button>
);

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor || !editorState) return null;

  const chain = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface px-2 py-1.5">
      {/* Text formatting */}
      <TbBtn onClick={() => chain().toggleBold().run()} active={editorState.isBold} disabled={!editorState.canBold} title="Bold">
        <Bold size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().toggleItalic().run()} active={editorState.isItalic} disabled={!editorState.canItalic} title="Italic">
        <Italic size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().toggleStrike().run()} active={editorState.isStrike} disabled={!editorState.canStrike} title="Strikethrough">
        <Strikethrough size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().toggleCode().run()} active={editorState.isCode} disabled={!editorState.canCode} title="Inline Code">
        <Code size={14} />
      </TbBtn>

      <Divider />

      {/* Clear */}
      <TbBtn onClick={() => chain().unsetAllMarks().run()} title="Clear marks">
        <RemoveFormatting size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().clearNodes().run()} title="Clear nodes">
        <Pilcrow size={14} />
      </TbBtn>

      <Divider />

      {/* Block types */}
      <TbBtn onClick={() => chain().setParagraph().run()} active={editorState.isParagraph} title="Paragraph">
        <span className="text-[11px] font-medium">¶</span>
      </TbBtn>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <TbBtn
          key={level}
          onClick={() => chain().toggleHeading({ level }).run()}
          active={editorState[`isHeading${level}` as keyof typeof editorState] as boolean}
          title={`Heading ${level}`}
        >
          <span className="text-[11px] font-medium">H{level}</span>
        </TbBtn>
      ))}

      <Divider />

      {/* Lists & blocks */}
      <TbBtn onClick={() => chain().toggleBulletList().run()} active={editorState.isBulletList} title="Bullet list">
        <List size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().toggleOrderedList().run()} active={editorState.isOrderedList} title="Ordered list">
        <ListOrdered size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().toggleCodeBlock().run()} active={editorState.isCodeBlock} title="Code block">
        <Code2 size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().toggleBlockquote().run()} active={editorState.isBlockquote} title="Blockquote">
        <Quote size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().setHorizontalRule().run()} title="Horizontal rule">
        <Minus size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().setHardBreak().run()} title="Hard break">
        <span className="text-[11px] font-medium">↵</span>
      </TbBtn>

      <Divider />

      {/* History */}
      <TbBtn onClick={() => chain().undo().run()} disabled={!editorState.canUndo} title="Undo">
        <CornerUpLeft size={14} />
      </TbBtn>
      <TbBtn onClick={() => chain().redo().run()} disabled={!editorState.canRedo} title="Redo">
        <CornerUpRight size={14} />
      </TbBtn>
    </div>
  );
};
