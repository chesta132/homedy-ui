import { EditorContent, Editor } from "@tiptap/react";
import { MenuBar } from "./menubar";
import { cn } from "@/lib/utils";

export type RichEditorProps = React.ComponentProps<"div"> & { editor: Editor | null };

export const RichEditor = ({ editor, className, ...props }: RichEditorProps) => {
  if (!editor) return null;
  const editable = editor.options.editable;

  return (
    <div className={cn("flex flex-col lg:flex-row h-[calc(100dvh-10.5rem)]", className)} {...props}>
      {editable && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className={cn(
          `
          tiptap-content
          cursor-text
          flex-1 px-4 py-3 overflow-y-auto
          text-sm text-fg bg-card
          [&_.tiptap]:outline-none
          [&_.tiptap_p]:leading-relaxed
          [&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:text-xl [&_.tiptap_h1]:font-semibold [&_.tiptap_h1]:tracking-tight
          [&_.tiptap_h2]:mb-1.5 [&_.tiptap_h2]:text-lg [&_.tiptap_h2]:font-semibold
          [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:text-base [&_.tiptap_h3]:font-semibold
          [&_.tiptap_code]:rounded [&_.tiptap_code]:border [&_.tiptap_code]:border-border-sub [&_.tiptap_code]:bg-elevated [&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-px [&_.tiptap_code]:font-mono [&_.tiptap_code]:text-xs [&_.tiptap_code]:text-subtle
          [&_.tiptap_pre]:my-2 [&_.tiptap_pre]:overflow-x-auto [&_.tiptap_pre]:rounded-[--radius-md] [&_.tiptap_pre]:border [&_.tiptap_pre]:border-border [&_.tiptap_pre]:bg-surface [&_.tiptap_pre]:px-4 [&_.tiptap_pre]:py-3 [&_.tiptap_pre]:font-mono [&_.tiptap_pre]:text-xs [&_.tiptap_pre]:text-subtle
          [&_.tiptap_pre_code]:border-none [&_.tiptap_pre_code]:bg-transparent [&_.tiptap_pre_code]:p-0
          [&_.tiptap_blockquote]:my-2 [&_.tiptap_blockquote]:border-l-2 [&_.tiptap_blockquote]:border-border-sub [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-subtle
          [&_.tiptap_ul]:my-1 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:text-fg
          [&_.tiptap_ol]:my-1 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:text-fg
          [&_.tiptap_li]:my-0.5
          [&_.tiptap_hr]:my-4 [&_.tiptap_hr]:border-border
          [&_.tiptap_strong]:font-semibold [&_.tiptap_strong]:text-fg
          [&_.tiptap_em]:text-subtle
          [&_.tiptap_s]:text-dim
          [&_.tiptap_p.is-editor-empty:first-child]:before:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child]:before:float-left [&_.tiptap_p.is-editor-empty:first-child]:before:h-0 [&_.tiptap_p.is-editor-empty:first-child]:before:text-muted [&_.tiptap_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]
        `,
          !editable && "cursor-default",
        )}
        onClick={() => editable && !editor.isFocused && editor.chain().focus("end").run()}
      />
    </div>
  );
};
