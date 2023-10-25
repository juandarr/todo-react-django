import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
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
					'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-3 before:left-4 before:opacity-60 before-pointer-events-none',
			}),
			CharacterCount.configure({
				limit,
			}),
		],
		content: ``,
		// 		<h2>
		//   Hi there,
		// </h2>
		// <p>
		//   this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
		// </p>
		// <ul>
		//   <li>
		//     That’s a bullet list with one …
		//   </li>
		//   <li>
		//     … or two list items.
		//   </li>
		// </ul>
		// <p>
		//   Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
		// </p>
		// <pre><code class="language-css">body {
		// display: none;
		// }</code></pre>
		// <p>
		//   I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
		// </p>
		// <blockquote>
		//   Wow, that’s amazing. Good work, boy! 👏
		//   <br />
		//   — Mom
		// </blockquote>
		// 		`,
	});

	return editor;
}
