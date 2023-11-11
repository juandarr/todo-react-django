import React, { useContext, useRef, useState, useEffect } from 'react';

import type { TaskItemProps } from '../../lib/customTypes';

import { Checkbox } from '../ui/checkbox';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import { useToast } from '../ui/toast/use-toast';

import { type Todo } from '../../../../todo-api-client/models';

import DeleteModal from '../modals/deleteModal';
import { Calendar2, Task, Flag, BookSaved } from 'iconsax-react';
import EditModalTodo from '../modals/editModalTodo';
import { UserContext } from '../../contexts/UserContext';
import { waitForElementToExist } from '../../lib/utils';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';

export default function TaskItem({
	todo,
	lists,
	toggleTodo,
	editTodo,
	editTodoFull,
	deleteTodo,
}: TaskItemProps): React.JSX.Element {
	const user = useContext(UserContext);
	const { toast } = useToast();
	const [inFocus, setInFocus] = useState(false);

	const [newTodoEdit, setNewTodoEdit] = useState<Todo>(todo);

	const textAreaTitle = useRef<HTMLTextAreaElement>(null);

	useAutosizeTextArea(
		textAreaTitle.current,
		`#todoTitle-${todo.id}`,
		newTodoEdit.title,
	);

	const options: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: user.timeZone,
	};

	const editHandler = (
		event:
			| React.MouseEvent<HTMLDivElement>
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.KeyboardEvent<HTMLDivElement>,
		todo: Todo,
	): void => {
		event.preventDefault();
		if (todo.title !== newTodoEdit.title) {
			editTodo(todo.id as number, newTodoEdit.title, setInFocus)
				.then(() => {
					toast({
						title: 'Task title was updated!',
						description: '',
					});
				})
				.catch((error) => {
					console.log('There was an error updating task title: ', error);
					toast({
						variant: 'destructive',
						title: 'There was an error updating task title: ',
						description: error.message,
					});
				});
		} else {
			setInFocus(false);
		}
	};

	const handleKeyDown = (
		e:
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.KeyboardEvent<HTMLDivElement>,
		todo: Todo,
	): void => {
		if (e.key === 'Enter') {
			// Submit the form when Enter is pressed
			editHandler(e, todo);
		}
	};

	function toggleHandler(checked: boolean): void {
		toggleTodo(todo.id as number, checked)
			.then((result) => {})
			.catch((error) => {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'There was an error updating task: ',
						description: error.message,
					});
				}
			});
	}

	/* Resize textArea element on component mount */
	useEffect(() => {
		waitForElementToExist(`#todoTitle-${todo.id}`)
			.then((element) => {
				(textAreaTitle.current as HTMLElement).style.height = '0px';
				(textAreaTitle.current as HTMLElement).style.height = `${
					(textAreaTitle.current as HTMLElement).scrollHeight
				}px`;
			})
			.catch(() => {});
	}, []);

	return (
		<>
			<div className='parent flex'>
				<div className='mt-3 flex w-2/12 items-start justify-center'>
					<Checkbox
						id={'checkbox-' + todo.id}
						checked={todo.complete}
						onCheckedChange={(checked) => {
							const s = document.getElementById(`item-${todo.id}`);
							s?.classList.toggle('fade-out');
							toggleHandler(checked as boolean);
						}}
						className='border-2 border-black'
					/>
				</div>
				<form className='relative flex flex-1 flex-col' id='editTitle-form'>
					<div className='flex items-center justify-center'>
						<div className='relative flex flex-1 items-center'>
							<textarea
								className={`taskitem mb-1 mr-2 mt-1 h-fit w-full rounded-xl bg-white px-4 py-1 text-sm font-medium ${
									(todo.complete as boolean) ? 'text-gray-400' : 'text-gray-700'
								} focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-violet-400`}
								name='editTitle'
								id={`todoTitle-${todo.id}`}
								ref={textAreaTitle}
								placeholder='Enter title'
								value={newTodoEdit.title}
								onFocus={(event) => {
									setInFocus(true);
								}}
								onBlur={(event) => {
									if (event.relatedTarget?.id !== 'saveTitle-button') {
										// flushSync(() => {
										setInFocus(false);
										setNewTodoEdit(todo);
										// });
										// adjustHeight(textAreaTitle.current as HTMLElement);
									}
								}}
								onChange={(event) => {
									setNewTodoEdit((old) => ({
										...old,
										title: event.target.value,
									}));

									// adjustHeight(textAreaTitle.current as HTMLElement);
								}}
								onKeyDown={(e) => {
									handleKeyDown(e, todo);
								}}
								maxLength={100}
								rows={1}
							/>
							{inFocus ? (
								<>
									<div
										id='todoEditTextCount'
										className={`absolute -bottom-3 right-9 text-[10px] ${
											newTodoEdit.title.length < 50
												? 'text-violet-400'
												: 'text-amber-500'
										}`}>
										<span id='current'>{newTodoEdit.title.length}</span>
										<span id='maximum'>/100</span>
									</div>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger
												id='saveTitle-button'
												className='absolute -right-4 bottom-0 top-0 flex items-center justify-center'>
												<div
													className='text-violet-500 hover:text-violet-600'
													onClick={(event) => {
														editHandler(event, todo);
													}}
													style={{ cursor: 'pointer' }}>
													<BookSaved size={'1.2rem'} />
												</div>
											</TooltipTrigger>
											<TooltipContent className='bg-violet-500'>
												<p className='font-bold text-white'>Save</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</>
							) : (
								<></>
							)}
						</div>
					</div>
					<div className='mt-0 flex justify-start pb-2 pt-0 text-sm text-gray-400'>
						<div className='mr-2 flex items-center justify-start pl-4'>
							<Flag
								className={`mr-1 ${
									todo.priority === 1
										? 'text-rose-400'
										: todo.priority === 2
										? 'text-amber-400'
										: todo.priority === 3
										? 'text-sky-400'
										: 'text-gray-400'
								}`}
								size={'1rem'}
								variant='Bold'
							/>
						</div>
						<div className='mr-2 w-fit text-center'>
							{todo.dueDate !== undefined ? (
								<div
									className={`flex items-center justify-start text-gray-600 ${
										(todo.complete as boolean) ? 'line-through' : ''
									}`}>
									<Calendar2 className='mr-1' size={'1.2rem'} />
									<div className='text-xs'>
										{todo.dueDate !== undefined
											? (todo.dueDate as Date).toLocaleDateString(
													'en-US',
													options,
											  )
											: ''}
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
						{(todo.complete as boolean) ? (
							<div className='w-fit text-center'>
								<div className='flex items-center justify-start text-gray-600'>
									<Task className='mr-1' size={'1.2rem'} />
									<div className='text-xs'>
										{(todo.completedAt as Date).toLocaleString('en-US', {
											...options,
											hour: 'numeric',
											minute: 'numeric',
										})}
									</div>
								</div>
							</div>
						) : (
							<></>
						)}
					</div>
				</form>
				<div
					id={`todo-${todo.id}`}
					className='hidden-child mt-3 flex w-[14%] items-start justify-end px-3'>
					<EditModalTodo
						editTodoFull={editTodoFull}
						todo={todo}
						lists={lists}
						parentId={`todo-${todo.id}`}
						key={`edit-${todo.id}`}
					/>
					<span className='mr-2'></span>
					<DeleteModal
						deleteFunction={deleteTodo}
						deleteEntity={'todo'}
						parentId={`todo-${todo.id}`}
						id={todo.id as number}
						key={`del-${todo.id}`}
						size={1.6}
					/>
				</div>
				<div className='w-[5%]'></div>
			</div>
		</>
	);
}
