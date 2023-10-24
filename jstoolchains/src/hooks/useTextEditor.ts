import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import { useEditor } from '@tiptap/react';
import { type Editor } from '@tiptap/react';

export default function useTextEditor(initialContent: string): Editor | null {
	const editor = useEditor({
		extensions: [
			Document,
			Paragraph,
			Text,
			TaskList,
			TaskItem.configure({ nested: true }),
		],
		content: '',
	});

	return editor;
}
