import { type Editor, EditorContent } from '@tiptap/react';
import React, { type HTMLProps, useEffect, useRef, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { TaskSquare } from 'iconsax-react';

export interface TextEditorProps extends HTMLProps<HTMLDivElement> {
	editor: Editor | null;
	isDisabled: boolean;
}

export default function TextEditor({
	editor,
	className,
	isDisabled,
	...props
}: TextEditorProps): React.JSX.Element | null {
	const textAreaDescriptionCount = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onBlur = (e: any): void => {
			(textAreaDescriptionCount.current as HTMLDivElement).style.display =
				'none';
		};
		const onFocus = (e: any): void => {
			(textAreaDescriptionCount.current as HTMLDivElement).style.display =
				'block';
		};

		editor?.on('blur', onBlur);
		editor?.on('focus', onFocus);
		return () => {
			editor?.off('blur', onBlur);
			editor?.off('focus', onFocus);
		};
	}, []);

	if (editor === null) {
		return null;
	}

	useMemo(() => {
		editor.setEditable(!isDisabled);
	}, [isDisabled]);

	const characterCountExtension = useMemo(
		() =>
			editor.extensionManager.extensions.find(
				(ext) => ext.name === 'characterCount',
			),
		[],
	);
	return (
		<div className='relative mb-2 ml-4 mr-4 mt-2 flex flex-1 flex-col focus-within:rounded-lg focus-within:outline'>
			<div className='flex max-h-[20vh] items-center justify-start overflow-y-auto rounded-t-lg bg-sky-50 px-1 py-1 text-sm text-gray-900'>
				<div
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					className={`pl-3 ${
						editor.isActive('taskList') ? 'is-active' : ''
					} glowing cursor-pointer  text-violet-500 hover:text-violet-600`}>
					<TaskSquare size='18' variant='Broken' />
				</div>
			</div>
			<EditorContent
				editor={editor}
				className={cn('edit-region', className)}
				{...props}
				ref={null}
			/>
			<div
				id='todoDescriptionCount'
				ref={textAreaDescriptionCount}
				className={`absolute -bottom-[17px] right-2 hidden text-[10px] ${
					editor.storage.characterCount.characters() >
					0.9 * characterCountExtension?.options.limit
						? 'text-rose-400'
						: 'text-gray-400'
				}`}>
				<span>{editor.storage.characterCount.characters()}</span>
				<span>/{characterCountExtension?.options.limit}</span>
			</div>
		</div>
	);
}
