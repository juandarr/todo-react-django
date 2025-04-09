import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, type Editor } from '@tiptap/react';
import Link from '@tiptap/extension-link';

export default function useTextEditor(
	initialContent: string,
	placeholder: string
): Editor | null {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
				history: false,
				heading: {
					levels: [1, 2, 3],
				},
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({
				placeholder,
				emptyEditorClass:
					'is-editor-empty',
			}),
			Link.configure({
				autolink: true,
				openOnClick: true,
				linkOnPaste: true,
			})
		],
		content: initialContent
	});

	return editor;
}
