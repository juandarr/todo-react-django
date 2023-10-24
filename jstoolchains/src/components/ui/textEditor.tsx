// import Document from '@tiptap/extension-document';
// import Paragraph from '@tiptap/extension-paragraph';
// import TaskItem from '@tiptap/extension-task-item';
// import TaskList from '@tiptap/extension-task-list';
// import Text from '@tiptap/extension-text';
// import {
// 	EditorContent,
// 	type EditorContentProps,
// 	useEditor,
// } from '@tiptap/react';
// import React, { useEffect } from 'react';
// export type TextEditorProps = Omit<EditorContentProps, 'editor'>;

// export default function TextEditor({
// 	...props
// }: TextEditorProps): React.ReactElement<typeof EditorContent> | null {
// 	const editor = useEditor({
// 		extensions: [
// 			Document,
// 			Paragraph,
// 			Text,
// 			TaskList,
// 			TaskItem.configure({ nested: true }),
// 		],
// 		content: '',
// 	});

// 	useEffect(() => {
// 		const editorRegion = document.getElementById('editorCreateTodo');
// 		editorRegion?.addEventListener('click', () => {
// 			editor?.commands.focus();
// 		});

// 		return () => {
// 			editorRegion?.removeEventListener('click', () => {
// 				editor?.commands.focus();
// 			});
// 		};
// 	}, [editor]);

// 	if (editor === null) {
// 		return null;
// 	}
// 	return <EditorContent id={'editorCreateTodo'} editor={editor} {...props} />;
// }
