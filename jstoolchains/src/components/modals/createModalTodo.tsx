import React, { useState, useRef, type CSSProperties, useEffect } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import { AddCircle, Flag } from 'iconsax-react';

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

import type { CreateModalTodoProps, todoType } from '../../lib/customTypes';
import { PriorityEnum } from '../../lib/userSettings';
import { isDescendantOf } from '../../lib/utils';
import useAutosizeTextArea from '../../lib/useAutosizeTextArea';
import { DatePickerWithPresets } from '../ui/datepicker';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function CreateModalTodo({
	lists,
	addTodo,
	userInfo,
}: CreateModalTodoProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [newTodo, setNewTodo] = useState<todoType>({
		title: '',
		description: '',
		priority: PriorityEnum.None,
		dueDate: undefined,
		list: userInfo.inboxListId.toString(),
	});
	const [status, setStatus] = useState('typing');
	const { toast } = useToast();

	const textAreaTitle = useRef<HTMLTextAreaElement>(null);
	const textAreaDescription = useRef<HTMLTextAreaElement>(null);
	const textAreaTitleCount = useRef<HTMLDivElement>(null);
	const textAreaDescriptionCount = useRef<HTMLDivElement>(null);

	useAutosizeTextArea(textAreaTitle.current, newTodo.title);
	useAutosizeTextArea(
		textAreaDescription.current,
		newTodo.description as string,
	);

	const openModalCallback = (event: KeyboardEvent): void => {
		if (!isDescendantOf(event.target as HTMLElement, 'form')) {
			if (event.key === 'q' && !isOpen) {
				event.preventDefault();
				openPopover();
			}
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', openModalCallback);
		return () => {
			document.removeEventListener('keydown', openModalCallback);
		};
	}, [openModalCallback]);

	useEffect(() => {
		if (status === 'typing') {
			if (textAreaTitle.current !== null) {
				textAreaTitle.current.focus();
			}
		}
	}, [status]);

	const createHandleSubmit = async (): Promise<void> => {
		if (newTodo.title === '') return;
		setStatus('submitting');

		try {
			await addTodo(newTodo, 'NavBar');
			setNewTodo((oldTodo) => ({
				...oldTodo,
				title: '',
				description: '',
				priority: PriorityEnum.None,
				dueDate: undefined,
			}));
			setStatus('typing');
			toast({
				title: 'Task was created!',
				description: '',
			});
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error creating the task: ',
					description: error.message,
				});
			}
			setStatus('typing');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			// Submit the form when Ctrl (Windows/Linux) or Command (Mac) + Enter is pressed
			createHandleSubmit()
				.then(() => {})
				.catch(() => {});
		}
	};

	const openPopover = (): void => {
		setNewTodo({
			title: '',
			description: '',
			priority: PriorityEnum.None,
			list: userInfo.inboxListId.toString(),
			dueDate: undefined,
		});
		setStatus('typing');
		setIsOpen(true);
	};

	// const closePopover = (): void => {
	// 	setIsOpen(false);
	// };
	console.log('Modal todo creation opened', newTodo.dueDate);
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger asChild={true}>
						<TooltipTrigger asChild={true}>
							<button className='text-emerald-500 hover:text-emerald-600'>
								<AddCircle
									size='1.8rem'
									className='cursor-pointer'
									onClick={() => {
										openPopover();
									}}
								/>
							</button>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-emerald-500'>
						<p className='font-bold text-white'>Add todo</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={() => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='flex flex-col'
					onSubmit={(e) => {
						e.preventDefault();
						createHandleSubmit()
							.then(() => {})
							.catch(() => {});
					}}>
					<div className='relative flex flex-1 flex-col'>
						<textarea
							id='todoTitle'
							name='title'
							value={newTodo.title}
							ref={textAreaTitle}
							placeholder='Name this todo'
							className='mb-3 ml-4 mr-4 mt-4 rounded-lg bg-gray-300 px-4 py-3 text-base font-medium text-gray-900 placeholder:text-gray-500'
							onChange={(event) => {
								setNewTodo((old) => ({ ...old, title: event.target.value }));
							}}
							onFocus={(e) => {
								(textAreaTitleCount.current as HTMLDivElement).style.display =
									'block';
								e.target.setSelectionRange(
									e.target.value.length,
									e.target.value.length,
								);
							}}
							onBlur={(e) => {
								(textAreaTitleCount.current as HTMLDivElement).style.display =
									'none';
							}}
							onKeyDown={(e) => {
								handleKeyDown(e);
							}}
							disabled={status === 'submitting'}
							rows={1}
							maxLength={100}
							required
						/>
						<div
							id='todoTitleCount'
							ref={textAreaTitleCount}
							className={`absolute -bottom-1 right-6 hidden text-[10px] ${
								newTodo.title.length < 50 ? 'text-gray-400' : 'text-amber-500'
							}`}>
							<span>{newTodo.title.length}</span>
							<span>/100</span>
						</div>
					</div>
					<div className='relative flex flex-1 flex-col'>
						<textarea
							id='todoDescription'
							name='description'
							value={newTodo.description}
							ref={textAreaDescription}
							placeholder='Description'
							className='mb-2 ml-4 mr-4 mt-2 rounded-lg bg-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500'
							onChange={(event) => {
								setNewTodo((old) => ({
									...old,
									description: event.target.value,
								}));
							}}
							onFocus={(e) => {
								(
									textAreaDescriptionCount.current as HTMLDivElement
								).style.display = 'block';
								e.target.setSelectionRange(
									e.target.value.length,
									e.target.value.length,
								);
							}}
							onBlur={(e) => {
								(
									textAreaDescriptionCount.current as HTMLDivElement
								).style.display = 'none';
							}}
							onKeyDown={(e) => {
								handleKeyDown(e);
							}}
							rows={1}
							maxLength={1000}
							disabled={status === 'submitting'}
						/>
						<div
							id='todoDescriptionCount'
							ref={textAreaDescriptionCount}
							className={`absolute -bottom-2 right-6 hidden text-[10px] ${
								(newTodo.description as string).length < 500
									? 'text-gray-400'
									: 'text-amber-500'
							}`}>
							<span>{(newTodo.description as string).length}</span>
							<span>/1000</span>
						</div>
					</div>
					<div className='mb-3 ml-4 mr-4 mt-3 flex items-center justify-around'>
						<Select
							value={newTodo.priority}
							onValueChange={(value) => {
								setNewTodo((old) => ({ ...old, priority: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger
								className={`mr-3 h-2 w-5/12 p-3 ${
									newTodo.priority === '1'
										? 'bg-rose-200'
										: newTodo.priority === '2'
										? 'bg-amber-200'
										: newTodo.priority === '3'
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
							value={newTodo.list}
							onValueChange={(value) => {
								setNewTodo((old) => ({ ...old, list: value }));
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
					<div className='mb-3 ml-4 mr-4 flex items-center justify-start'>
						<DatePickerWithPresets newTodo={newTodo} setNewTodo={setNewTodo} />
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-between'>
						<button
							type='submit'
							className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={
								!!(status === 'submitting' || newTodo.title.length === 0)
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
								Create
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
				<PopoverArrow className='fill-emerald-500' />
			</PopoverContent>
		</Popover>
	);
}
