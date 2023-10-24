import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import React from 'react';

// const CustomDocument = Document.extend({
// 	content: 'taskList',
// });

// const CustomTaskItem = TaskItem.extend({
// 	content: 'inline*',
// });
// CustomTaskItem.configure({
// 	nested: true,
// });
export default function TextEditor(): React.JSX.Element | null {
	const editor = useEditor({
		extensions: [
			Document,
			Paragraph,
			Text,
			TaskList,
			TaskItem.configure({ nested: true }),
		],
		content: `
      <p>
        This is a radically reduced version of tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
        <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true">flour</li>
        <li data-type="taskItem" data-checked="true">baking powder</li>
      </ul>
    `,
	});
	if (editor === null) {
		return null;
	}

	return (
		<>
			<button
				onClick={() => editor.chain().focus().toggleTaskList().run()}
				className={editor.isActive('taskList') ? 'is-active' : ''}>
				toggleTaskList
			</button>
			<button
				onClick={() => editor.chain().focus().splitListItem('taskItem').run()}
				disabled={!editor.can().splitListItem('taskItem')}>
				splitListItem
			</button>
			<button
				onClick={() => editor.chain().focus().sinkListItem('taskItem').run()}
				disabled={!editor.can().sinkListItem('taskItem')}>
				sinkListItem
			</button>
			<button
				onClick={() => editor.chain().focus().liftListItem('taskItem').run()}
				disabled={!editor.can().liftListItem('taskItem')}>
				liftListItem
			</button>
			<EditorContent
				editor={editor}
				className='mb-2 ml-4 mr-4 mt-2 rounded-lg bg-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500'
			/>
		</>
	);
}
