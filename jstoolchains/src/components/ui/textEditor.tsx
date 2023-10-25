import { type Editor, EditorContent } from '@tiptap/react';
import React, { type HTMLProps, useEffect, useRef, useMemo } from 'react';
import { cn } from '../../lib/utils';

export interface TextEditorProps extends HTMLProps<HTMLDivElement> {
	editor: Editor | null;
	isDisabled: boolean;
}

export default function TextEditor({
	editor,
	className,
	id,
	isDisabled,
	...props
}: TextEditorProps): React.JSX.Element | null {
	const textAreaDescriptionCount = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const editorRegion = document.getElementById(id as string);
		editorRegion?.addEventListener('click', () => {
			editor?.commands.focus();
		});

		return () => {
			editorRegion?.removeEventListener('click', () => {
				editor?.commands.focus();
			});
		};
	}, []);

	useEffect(() => {
		const onBlur = (): void => {
			(textAreaDescriptionCount.current as HTMLDivElement).style.display =
				'none';
		};
		const onFocus = (): void => {
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
		<div className='relative flex flex-1 flex-col'>
			<EditorContent
				id={id}
				editor={editor}
				className={cn('editRegion', className)}
				{...props}
				ref={null}
			/>
			<div
				id='todoDescriptionCount'
				ref={textAreaDescriptionCount}
				className={`absolute -bottom-2 right-6 hidden text-[10px] ${
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
