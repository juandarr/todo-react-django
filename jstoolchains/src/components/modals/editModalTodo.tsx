import React, { useState, useRef, useEffect } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import { Edit, Flag } from 'iconsax-react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
	PopoverClose,
} from '../ui/popover';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

import { useToast } from '../ui/toast/use-toast';

import type { EditModalTodoProps, todoType } from '../../lib/customTypes';
import { PriorityEnum } from '../../lib/userSettings';

import { waitForElementToExist } from '../../lib/utils';
import { DatePickerWithPresets } from '../ui/datepicker';
import useTextEditor from '../../hooks/useTextEditor';
import TextEditor from '../ui/textEditor';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';

export default function EditModalTodo({
	editTodoFull,
	todo,
	lists,
	parentId,
	userInfo
}: EditModalTodoProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [newEditTodo, setNewEditTodo] = useState<todoType>({
		title: '',
		description: '',
	});
	const editorDesc = useTextEditor('', 'Description ...', 1000);
	const [status, setStatus] = useState('typing');
	const { toast } = useToast();

	const textAreaRefTitle = useRef<HTMLTextAreaElement>(null);
	const textAreaTitleCount = useRef<HTMLDivElement>(null);

	useAutosizeTextArea(
		textAreaRefTitle.current,
		'#todoEditTitle',
		newEditTodo.title,
	);

	useEffect(() => {
		if (status === 'typing') {
			if (textAreaRefTitle.current !== null) {
				textAreaRefTitle.current.focus();
			}
		}
	}, [status]);

	const editHandleSubmit = async (): Promise<void> => {
		if (newEditTodo.title === '') return;
		const updatedContent = editorDesc?.getHTML();
		const tmpEditTodo = { ...newEditTodo };
		tmpEditTodo.description = updatedContent;
		setStatus('submitting');

		try {
			await editTodoFull(tmpEditTodo);
			closePopover();
			toast({
				title: 'Task was updated!',
				description: '',
			});
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error updating the task: ',
					description: error.toString(),
				});
			}
			setStatus('typing');
		}
	};

	const handleKeyDown = (
		e:
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.KeyboardEvent<HTMLDivElement>,
	): void => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			// Submit the form when Ctrl (Windows/Linux) or Command (Mac) + Enter is pressed
			editHandleSubmit()
				.then(() => {})
				.catch(() => {});
		}
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};

	const openPopover = (): void => {
		toggleHidden();
		const tmpTodo: todoType = {
			...todo,
			list: todo.list?.toString(),
			priority: todo.priority?.toString(),
		};
		setNewEditTodo(tmpTodo);
		editorDesc?.commands.setContent(tmpTodo.description as string);
		waitForElementToExist('#todoEditTitle')
			.then(() => {
				// We need to reset the height momentarily to get the correct scrollHeight for the textarea
				(textAreaRefTitle.current as HTMLTextAreaElement).style.height = '0px';
				// We then set the height directly, outside of the render loop
				// Trying to set this with state or a ref will product an incorrect value.
				(
					textAreaRefTitle.current as HTMLTextAreaElement
				).style.height = `${textAreaRefTitle.current?.scrollHeight}px`;
				setStatus('typing');
			})
			.catch(() => {});
		
		setIsOpen(true);

		waitForElementToExist('#todoEditTitleCount')
			.then((element) => {
				(textAreaTitleCount.current as HTMLDivElement).style.display = 'block';
			})
			.catch(() => {});
	};

	const toggleHidden = (): void => {
		const el: HTMLElement = document.getElementById(parentId) as HTMLElement;
		if (el !== null) el.classList.toggle('hidden-child');
	};

	console.log('Modal todo edition opened');

	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						className='flex cursor-pointer items-center text-sky-500 hover:text-sky-600'
						onClick={(event) => {
							openPopover();
						}}>
						<TooltipTrigger>
							<Edit className='edit-todo' />
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-sky-500'>
						<p className='font-bold text-white'>Edit todo</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				side={'left'}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					toggleHidden();
				}}
				className='max-h-[80vh] w-96 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='flex flex-col'
					onSubmit={(e) => {
						e.preventDefault();
						editHandleSubmit()
							.then(() => {})
							.catch(() => {});
					}}>
					<div className='relative flex flex-1 flex-col'>
						<textarea
							id='todoEditTitle'
							ref={textAreaRefTitle}
							name='title'
							value={newEditTodo.title}
							placeholder='Name this todo'
							className='mb-3 ml-4 mr-4 mt-4 overflow-y-hidden rounded-lg bg-gray-300 px-4 py-3 text-base font-medium text-gray-900 placeholder:text-gray-500'
							onChange={(event) => {
								setNewEditTodo((old) => ({
									...old,
									title: event.target.value,
								}));
							}}
							onFocus={(e) => {
								e.target.setSelectionRange(
									e.target.value.length,
									e.target.value.length,
								);
								if (textAreaTitleCount.current !== null) {
									textAreaTitleCount.current.style.display = 'block';
								}
							}}
							onBlur={(e) => {
								(textAreaTitleCount.current as HTMLDivElement).style.display =
									'none';
							}}
							onKeyDown={handleKeyDown}
							disabled={status === 'submitting'}
							rows={1}
							autoFocus
							maxLength={100}
							required
						/>
						<div
							id='todoEditTitleCount'
							ref={textAreaTitleCount}
							className={`absolute -bottom-1 right-6 hidden text-[10px] ${
								newEditTodo.title.length < 50
									? 'text-gray-400'
									: 'text-amber-500'
							}`}>
							<span>{newEditTodo.title.length}</span>
							<span>/100</span>
						</div>
					</div>
					<TextEditor
						editor={editorDesc}
						charLimit={1000}
						id='todoDescription'
						className='mt-1 max-h-[40vh] overflow-y-auto rounded-b-lg bg-gray-300 text-sm text-gray-900 placeholder:text-gray-500'
						onKeyDown={(e) => {
							handleKeyDown(e);
						}}
						isDisabled={status === 'submitting'}
					/>
					<div className='mb-3 ml-4 mr-4 mt-3 flex items-center justify-between'>
						<Select
							value={newEditTodo.priority}
							onValueChange={(value) => {
								setNewEditTodo((old) => ({ ...old, priority: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger
								className={`mr-3 h-2 w-5/12 p-3 ${
									newEditTodo.priority === '1'
										? 'bg-rose-200'
										: newEditTodo.priority === '2'
										? 'bg-amber-200'
										: newEditTodo.priority === '3'
										? 'bg-sky-200'
										: 'bg-white'
								} `}>
								<SelectValue placeholder='Priority' />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(PriorityEnum).map((item, idx) => {
									return (
										<SelectItem key={idx} value={item[1]}>
											<div className='flex items-center justify-start'>
												<Flag
													className={`mr-1.5 ${
														idx === 3
															? 'text-rose-400'
															: idx === 2
															? 'text-amber-400'
															: idx === 1
															? 'text-sky-400'
															: 'text-gray-400'
													}`}
													size={'1rem'}
													variant='Bold'
												/>
												<span>{item[0]}</span>
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						<Select
							value={newEditTodo.list}
							onValueChange={(value) => {
								setNewEditTodo((old) => ({ ...old, list: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger className='h-2 w-6/12 p-3'>
								<SelectValue placeholder='List' />
							</SelectTrigger>
							<SelectContent>
								{lists.filter((list) => ( (list.id !== userInfo.inboxListId+1) && (list.id !== userInfo.inboxListId+2) && (list.archived !== true))).map((list) => (
									<SelectItem
										key={list.id}
										value={(list.id as number).toString()}>
										{list.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='mb-4 ml-4 mr-4 flex items-center justify-between'>
						<DatePickerWithPresets
							newTodo={newEditTodo}
							setNewTodo={setNewEditTodo}
							isDisabled={status === 'submitting'}
						/>
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-end'>
						<PopoverClose asChild={true}>
							<button
								className='flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-gray-300 p-3 text-lg text-black hover:bg-gray-400 focus-visible:ring focus-visible:ring-rose-300 disabled:bg-rose-200'
								disabled={status === 'submitting'}>
								Cancel
							</button>
						</PopoverClose>
						<button
							type='submit'
							className='ml-4 flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={
								!!(status === 'submitting' || newEditTodo.title.length === 0)
							}>
							<span
								className={`loader ${
									status === 'submitting' ? 'block' : 'invisible'
								}`}></span>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Save
							</span>
						</button>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
