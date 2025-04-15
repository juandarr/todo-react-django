import { EditorContent } from '@tiptap/react';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { cn } from '../../lib/utils';
import { TaskSquare } from 'iconsax-reactjs';
import { TextEditorProps} from '../../lib/customTypes';
import useTextEditor from '../../hooks/useTextEditor';


export default forwardRef(function TextEditor({
	todoDescription,
	charLimit,
	isDisabled,
	className,
	...props
}: TextEditorProps, ref): React.JSX.Element | null {
	const editor = useTextEditor('', 'Describe it ...');
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

		const onKeyDown = (event: KeyboardEvent): void => {
            if (editor) {
                const text = editor.getText();
				
				// Allow deletion and navigation keys even at the limit
				const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

				if (text.length >= charLimit) {
					console.log(event.key);
					// Prevent Enter (and any other key not allowed)
					if (!allowedKeys.includes(event.key)) {
						event.preventDefault();
					}
				}
            }
        };

		if (editor) {
			editor.on('blur', onBlur);
			editor.on('focus', onFocus);
			editor.on('update', onUpdate);
			editor.view.dom.addEventListener('keydown', onKeyDown);
            
            // Initial count
            onUpdate();
			editor.commands.setContent(todoDescription || '');
		}
		
		return () => {
			if (editor) {
				editor.off('blur', onBlur);
				editor.off('focus', onFocus);
				editor.off('update', onUpdate);
				editor.view.dom.removeEventListener('keydown', onKeyDown);
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
	
	// useImperativeHandle customizes the instance value exposed to parent refs
	useImperativeHandle(ref, () => ({
		// Expose a 'getHTMLContent' function
		getHTMLContent: () => {
		  return editor.getHTML(); // Return the current local state
		},
		// Expose a 'clearContent' function
		clearContent: () => {
		  editor.commands.clearContent();
		}
		// Dependency array for useImperativeHandle
	  }), [editor]);

	return (
		<div className='relative mb-2 ml-4 mr-4 mt-2 flex flex-1 flex-col focus-within:rounded-lg focus-within:outline focus-within:outline-2 focus-within:outline-fuchsia-500'>
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
});