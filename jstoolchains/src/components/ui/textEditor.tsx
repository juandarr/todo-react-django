import { type Editor, EditorContent } from '@tiptap/react';
import React, { type HTMLProps, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { TaskSquare } from 'iconsax-react';

export interface TextEditorProps extends HTMLProps<HTMLDivElement> {
	editor: Editor | null;
	charLimit: number;
	isDisabled: boolean;
}

export default function TextEditor({
	editor,
	className,
	charLimit,
	isDisabled,
	...props
}: TextEditorProps): React.JSX.Element | null {
	const textAreaDescriptionCount = useRef<HTMLDivElement>(null);
	const [charCount, setCharCount] = useState(0);


	useEffect(() => {
		const onBlur = (): void => {
            if (textAreaDescriptionCount.current) {
                textAreaDescriptionCount.current.style.display = 'none';
            }
        };
        
        const onFocus = (): void => {
            if (textAreaDescriptionCount.current) {
                textAreaDescriptionCount.current.style.display = 'block';
            }
        };

		const onUpdate = (): void => {
            if (editor) {
                // Get plain text and count characters
                const text = editor.getText();
                setCharCount(text.length);
            }
        };

		if (editor) {
			editor.on('blur', onBlur);
			editor.on('focus', onFocus);
			editor.on('update', onUpdate);
            
            // Initial count
            onUpdate();
		}
		
		return () => {
			if (editor) {
				editor.off('blur', onBlur);
				editor.off('focus', onFocus);
				editor.off('update', onUpdate);
			}
			
		};
	}, [editor]);

	if (editor === null) {
		return null;
	}

	useEffect(() => {
		if (editor) {
			editor.setEditable(!isDisabled);
		}
		
	}, [editor, isDisabled]);
	
	console.log('Count: ',editor.state.doc.content.size - 2, charCount);
	return (
		<div className='relative mb-2 ml-4 mr-4 mt-2 flex flex-1 flex-col focus-within:rounded-lg focus-within:outline'>
			<div className='flex max-h-[20vh] items-center justify-start overflow-y-auto rounded-t-lg bg-sky-50 px-1 py-1 text-sm text-gray-900'>
				<div
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					className={`pl-3 ${
						editor.isActive('taskList') ? 'is-active' : ''
					} glowing cursor-pointer text-violet-500 hover:text-violet-600`}>
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
					charCount >
					0.9 * charLimit
						? 'text-rose-400'
						: 'text-gray-400'
				}`}>
				<span>{charCount}</span>
				<span>/{charLimit}</span>
			</div>
		</div>
	);
}