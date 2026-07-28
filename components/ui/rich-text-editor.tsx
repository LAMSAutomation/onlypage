import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Link, Image, Undo, Redo, Quote } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const MenuButton = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
      active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`}
  >
    {children}
  </button>
);

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...', editable = true }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:', 'https://');
    if (url && url.startsWith('https://')) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return <div className="min-h-[200px] bg-slate-50 rounded-2xl border border-slate-200 animate-pulse" />;
  }

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-2 border-b border-slate-100 bg-slate-50/50">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold size={15} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic size={15} />
        </MenuButton>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
          <Heading1 size={15} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 size={15} />
        </MenuButton>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List size={15} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered size={15} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <Quote size={15} />
        </MenuButton>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <MenuButton onClick={addLink} active={editor.isActive('link')}>
          <Link size={15} />
        </MenuButton>
        <MenuButton onClick={addImage}>
          <Image size={15} />
        </MenuButton>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={15} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={15} />
        </MenuButton>
      </div>

      {/* Editor content */}
      <div className="px-4 py-3 text-sm leading-relaxed">
        <EditorContent editor={editor} className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-indigo-600" />
      </div>
    </div>
  );
}

export default RichTextEditor;
