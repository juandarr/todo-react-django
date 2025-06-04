import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorOptions, useEditor, type Editor } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import {
	RichTextLink,
	RichTextLinkOptions
} from '../components/ui/RichTextLink'; // Adjust path if needed

export default function useTextEditor(
	initialContent: string,
	placeholder: string
): Editor | null {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false
				},
				history: false,
				heading: {
					levels: [1, 2, 3]
				}
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({
				placeholder,
				emptyEditorClass: 'is-editor-empty'
			}),
			RichTextLink.configure({
				// You can override options defined in RichTextLink's addOptions()
				// or any options inherited from the base Link extension.

				// Example: To use standard boolean openOnClick behavior:
				openOnClick: true, // Overrides 'whenNotEditable'

				// These are standard Link options that RichTextLink inherits:
				autolink: true, // This will still work, the `preventAutolink` in custom rules handles conflicts
				linkOnPaste: true, // Similar to autolink

				// HTMLAttributes will be merged with those from addAttributes (like `title`)
				HTMLAttributes: {
					target: '_blank',
					rel: 'noopener noreferrer'
					// You could add a default class here if you wish
					// class: 'my-custom-link',
				}
			}) // Cast for type safety if desired
		],
		content: initialContent,
		// 4. Optional: Custom click handling for 'openOnClick: "whenNotEditable"'
		// If you keep `openOnClick: 'whenNotEditable'` (either as default or by configuring it),
		// you need custom logic to make it work.
		editorProps: {
			handleClickOn: (view, pos, node, nodePos, event, direct) => {
				// Check if the click is on your link mark
				const linkMark = node.marks.find(
					(m) => m.type.name === RichTextLink.name
				); // RichTextLink.name is 'link' by default unless overridden

				if (linkMark) {
					// Access the configured option for this specific extension instance
					const editorInstance =
						view.dom.closest('.ProseMirror')?.pmViewDesc?.editor;
					if (!editorInstance) return false;

					// Find the extension instance to get its configured options
					const currentExtension =
						editorInstance.extensionManager.extensions.find(
							(ext: any) => ext.name === RichTextLink.name // Or the overridden name if you set one
						);

					const openOnClickOption = currentExtension?.options.openOnClick;

					if (
						openOnClickOption === 'whenNotEditable' &&
						editorInstance.isEditable
					) {
						// Prevent default link behavior only if editable and option is 'whenNotEditable'
						event.preventDefault();
						console.log(
							"Link clicked in editable mode, 'whenNotEditable' prevented opening."
						);
						return true; // Mark as handled
					}
				}
				return false; // Let Tiptap handle other cases
			}
		} as EditorOptions['editorProps'] // Provide type for editorProps
	});

	return editor;
}
