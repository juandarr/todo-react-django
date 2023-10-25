import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { type Editor } from '@tiptap/react';

export default function useTextEditor(
	initialContent: string,
	placeholder: string,
	limit: number,
): Editor | null {
	const editor = useEditor({
		extensions: [
			Document,
			Paragraph,
			Text,
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({
				placeholder,
				emptyEditorClass:
					'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:opacity-60 before-pointer-events-none',
			}),
			CharacterCount.configure({
				limit,
			}),
		],
		content: '',
	});

	return editor;
}
