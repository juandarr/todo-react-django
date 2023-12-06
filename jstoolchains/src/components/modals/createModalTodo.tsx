import React, {
	useState,
	useRef,
	type CSSProperties,
	useEffect,
	useContext,
} from 'react';

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

import type { CreateModalTodoProps, todoType } from '../../lib/customTypes';
import { PriorityEnum } from '../../lib/userSettings';
import { isDescendantOf } from '../../lib/utils';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { DatePickerWithPresets } from '../ui/datepicker';
import { UserContext } from '../../contexts/UserContext';
import useTextEditor from '../../hooks/useTextEditor';
import TextEditor from '../ui/textEditor';

export default function CreateModalTodo({
	lists,
	addTodo,
}: CreateModalTodoProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const user = useContext(UserContext);
	const [newTodo, setNewTodo] = useState<todoType>({
		title: '',
		description: '',
		priority: PriorityEnum.None,
		dueDate: undefined,
		list: user.inboxListId.toString(),
	});
	const editorDesc = useTextEditor('', 'Description', 1000);

	const [status, setStatus] = useState('typing');

	const { toast } = useToast();

	const textAreaTitle = useRef<HTMLTextAreaElement>(null);
	const textAreaTitleCount = useRef<HTMLDivElement>(null);

	useAutosizeTextArea(textAreaTitle.current, '#todoTitle', newTodo.title);

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
	}, []);

	useEffect(() => {
		if (status === 'typing') {
			if (textAreaTitle.current !== null) {
				textAreaTitle.current.focus();
			}
		}
	}, [status]);

	const createHandleSubmit = async (): Promise<void> => {
		if (newTodo.title === '') return;
		const updatedContent = editorDesc?.getHTML();
		const tmpTodo = { ...newTodo };
		tmpTodo.description = updatedContent;
		setStatus('submitting');

		try {
			await addTodo(tmpTodo, 'NavBar');
			setNewTodo((oldTodo) => ({
				...oldTodo,
				title: '',
				description: '',
				priority: PriorityEnum.None,
				dueDate: undefined,
			}));
			setStatus('typing');
			editorDesc?.commands.clearContent();
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

	const handleKeyDown = (
		e:
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.KeyboardEvent<HTMLDivElement>,
	): void => {
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
			list: user.inboxListId.toString(),
			dueDate: undefined,
		});
		editorDesc?.commands.clearContent();
		setStatus('typing');
		setIsOpen(true);
	};

	console.log('Modal todo creation opened');
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
						<p className='bold text-white'>Add todo</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={() => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='max-h-[80vh] w-96 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
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
					<TextEditor
						editor={editorDesc}
						id='todoDescription'
						className='mt-1 max-h-[40vh] overflow-y-auto rounded-b-lg bg-gray-300 text-sm text-gray-900 placeholder:text-gray-500'
						onKeyDown={(e) => {
							handleKeyDown(e);
						}}
						isDisabled={status === 'submitting'}
					/>
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
					<div className='mb-4 ml-4 mr-4 flex items-center justify-start'>
						<DatePickerWithPresets
							newTodo={newTodo}
							setNewTodo={setNewTodo}
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
								!!(status === 'submitting' || newTodo.title.length === 0)
							}>
							<span
								className={`loader ${
									status === 'submitting' ? 'block' : 'invisible'
								}`}></span>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Create
							</span>
						</button>
					</div>
				</form>
				<PopoverArrow className='fill-emerald-500' />
			</PopoverContent>
		</Popover>
	);
}
