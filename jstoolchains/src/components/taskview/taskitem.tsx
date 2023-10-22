import React, { useEffect, useRef } from 'react';

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

export default function TaskItem({
	todo,
	lists,
	toggleTodo,
	editTodo,
	editTodoFull,
	deleteTodo,
	edit,
	setEdit,
	newTodoEdit,
	setNewTodoEdit,
}: TaskItemProps): React.JSX.Element {
	const { toast } = useToast();
	const showEdit = (edit[0] as boolean) && edit[1] === todo.id;
	const initialTitle = useRef<string>();

	const handleSubmit = (
		event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLDivElement>,
		todo: Todo,
	): void => {
		event.preventDefault();
		if (initialTitle.current !== newTodoEdit.title) {
			editTodo(todo.id as number, newTodoEdit.title, setEdit)
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
			setEdit([false, 0]);
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

	useEffect(() => {
		if (showEdit) {
			initialTitle.current = todo.title;
		}
	}, [showEdit]);

	return (
		<>
			<div className='parent flex'>
				<div className='mt-3 flex w-2/12 items-start justify-center'>
					<Checkbox
						id={'checkbox-' + todo.id}
						checked={todo.complete}
						onCheckedChange={(checked) => {
							toggleHandler(checked as boolean);
						}}
						className='border-2 border-black'
					/>
				</div>
				<form
					className='relative flex w-8/12 flex-col'
					id='editTitle-form'
					onSubmit={(event) => {
						handleSubmit(event, todo);
					}}>
					<div className='flex items-center justify-center'>
						{!showEdit ? (
							<input
								type='text'
								className={`mb-1 mr-2 mt-1 h-10 w-full bg-white text-base ${
									(todo.complete as boolean) ? 'text-gray-400' : 'text-gray-700'
								}  focus-visible:outline-none`}
								name='readTitle'
								value={todo.title}
								onClick={(e) => {
									setEdit([true, todo.id as number]);
									setNewTodoEdit((old) => ({ ...old, title: todo.title }));
								}}
								readOnly
							/>
						) : (
							<div className='flex flex-1 items-center'>
								<input
									type='text'
									className={`mb-1 mr-2 mt-1 h-10 w-full bg-white text-base ${
										(todo.complete as boolean)
											? 'text-gray-400'
											: 'text-gray-700'
									} focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-violet-400`}
									name='editTitle'
									value={newTodoEdit.title}
									onBlur={(event) => {
										if (event.relatedTarget?.id !== 'saveTitle-button') {
											setEdit([false, 0]);
										}
									}}
									onChange={(event) => {
										setNewTodoEdit((old) => ({
											...old,
											title: event.target.value,
										}));
									}}
									autoFocus
								/>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger
											id='saveTitle-button'
											className='flex justify-center'>
											<div
												className='text-fuchsia-500 hover:text-fuchsia-600'
												onClick={(event) => {
													handleSubmit(event, todo);
												}}
												style={{ cursor: 'pointer' }}>
												<BookSaved size={'1.2rem'} />
											</div>
										</TooltipTrigger>
										<TooltipContent className='bg-fuchsia-500'>
											<p className='font-bold text-white'>Save</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						)}
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
											? (todo.dueDate as Date).toDateString()
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
										{(todo.completedAt as Date).toDateString()}
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
					className='hidden-child mt-3 flex w-2/12 items-start justify-center'>
					<EditModalTodo
						editTodoFull={editTodoFull}
						todo={todo}
						lists={lists}
						parentId={`todo-${todo.id}`}
						key={`edit-${todo.id}`}
					/>
					<DeleteModal
						deleteFunction={deleteTodo}
						deleteEntity={'todo'}
						parentId={`todo-${todo.id}`}
						id={todo.id as number}
						key={`del-${todo.id}`}
					/>
				</div>
			</div>
		</>
	);
}
