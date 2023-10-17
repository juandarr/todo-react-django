import React, { useState, useRef, type CSSProperties, useEffect } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import { Edit } from 'iconsax-react';

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

import Spinner from 'react-spinners/DotLoader';

import type { EditModalTodoProps, todoType } from '../../lib/customTypes';
import { PriorityEnum } from '../../lib/userSettings';

import { waitForElementToExist } from '../../lib/utils';
import { DatePickerWithPresets } from '../ui/datepicker';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function EditModalTodo({
	editTodoFull,
	todo,
	lists,
	parentId,
}: EditModalTodoProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [newEditTodo, setNewEditTodo] = useState<todoType>({
		title: '',
		description: '',
	});
	const [status, setStatus] = useState('typing');
	const { toast } = useToast();

	const textAreaRefTitle = useRef<HTMLTextAreaElement>(null);
	const textAreaRefDescription = useRef<HTMLTextAreaElement>(null);

	const resizeTextArea = (textArea: HTMLElement): void => {
		if (textArea !== null) {
			textArea.style.height = 'auto';
			textArea.style.height = `${textArea.scrollHeight}px`;
		}
	};
	function adjustHeight(): void {
		resizeTextArea(textAreaRefTitle.current as HTMLElement);
		resizeTextArea(textAreaRefDescription.current as HTMLElement);
	}

	useEffect(() => {
		if (status === 'typing') {
			if (textAreaRefTitle.current !== null) {
				textAreaRefTitle.current.focus();
			}
		}
	}, [status]);

	useEffect(() => {
		// Apply adjust to height only when opening the popover
		if (isOpen) {
			// When element appears in the DOM, adjust height of textarea elements
			waitForElementToExist('#todoEditTitle')
				.then((element) => {
					adjustHeight();
				})
				.catch(() => {});
		}
	}, [isOpen]);
	const editHandleSubmit = async (): Promise<void> => {
		if (newEditTodo.title === '') return;
		setStatus('submitting');

		try {
			await editTodoFull(newEditTodo);
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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
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
		setStatus('typing');
		setIsOpen(true);
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
						onClick={(event) => {
							openPopover();
						}}>
						<TooltipTrigger asChild={true}>
							<a className='mr-2 flex cursor-pointer items-center text-2xl text-sky-500 hover:text-sky-600'>
								<Edit size={'1.6rem'} />
							</a>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-sky-500'>
						<p className='font-bold text-white'>Edit todo</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					toggleHidden();
				}}
				className='w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='font-serif flex flex-col'
					onSubmit={(e) => {
						e.preventDefault();
						editHandleSubmit()
							.then(() => {})
							.catch(() => {});
					}}>
					<div className='relative flex flex-1 flex-col'>
						<textarea
							id='todoEditTitle'
							name='title'
							value={newEditTodo.title}
							placeholder='Name this todo'
							className='mb-3 ml-4 mr-4 mt-4 overflow-y-hidden rounded-lg bg-gray-300 px-4 py-3 text-base font-medium text-gray-900 placeholder:text-gray-500'
							onChange={(event) => {
								adjustHeight();
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
							}}
							onKeyDown={handleKeyDown}
							disabled={status === 'submitting'}
							ref={textAreaRefTitle}
							rows={1}
							autoFocus
							maxLength={100}
							required
						/>
						<div
							id='count'
							className={`absolute -bottom-1 right-6 text-[10px] ${
								newEditTodo.title.length < 50
									? 'text-gray-400'
									: 'text-amber-500'
							}`}>
							<span id='current'>{newEditTodo.title.length}</span>
							<span id='maximum'>/100</span>
						</div>
					</div>
					<div className='relative flex flex-1 flex-col'>
						<textarea
							id='todoEditDescription'
							name='description'
							value={newEditTodo.description}
							placeholder='Description'
							className='mb-2 ml-4 mr-4 mt-1 overflow-y-hidden rounded-lg bg-gray-300 px-4 py-3 text-sm  text-gray-900 placeholder:text-gray-500'
							onChange={(event) => {
								adjustHeight();
								setNewEditTodo((old) => {
									return {
										...old,
										description: event.target.value,
									};
								});
							}}
							onFocus={(e) => {
								e.target.setSelectionRange(
									e.target.value.length,
									e.target.value.length,
								);
							}}
							onKeyDown={handleKeyDown}
							disabled={status === 'submitting'}
							ref={textAreaRefDescription}
							rows={1}
							maxLength={1000}
						/>
						<div
							id='count'
							className={`absolute -bottom-2 right-6 text-[10px] ${
								(newEditTodo.description as string).length < 500
									? 'text-gray-400'
									: 'text-amber-500'
							}`}>
							<span id='current'>
								{(newEditTodo.description as string).length}
							</span>
							<span id='maximum'>/1000</span>
						</div>
					</div>
					<div className='mb-3 ml-4 mr-4 mt-2 flex items-center justify-between'>
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
											{item[0]}
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
								{lists.map((list) => (
									<SelectItem
										key={list.id}
										value={(list.id as number).toString()}>
										{list.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='mb-3 ml-4 mr-4 flex items-center justify-between'>
						<DatePickerWithPresets
							newTodo={newEditTodo}
							setNewTodo={setNewEditTodo}
						/>
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-between'>
						<button
							type='submit'
							className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={
								!!(status === 'submitting' || newEditTodo.title.length === 0)
							}>
							<Spinner
								color='rgb(8 145 178)'
								loading={status === 'submitting'}
								cssOverride={override}
								size={20}
								aria-label='Loading Spinner'
								data-testid='loader'
							/>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Save
							</span>
						</button>
						<PopoverClose asChild={true}>
							<button
								className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-600 focus-visible:ring focus-visible:ring-rose-300 disabled:bg-rose-200'
								disabled={status === 'submitting'}>
								Cancel
							</button>
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
