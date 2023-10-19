import React from 'react';

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

import { Badge } from '../ui/badge';
import { PriorityEnumRev } from '../../lib/userSettings';
import DeleteModal from '../modals/deleteModal';
import { Edit2, Calendar2 } from 'iconsax-react';
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

	const handleSubmit = (
		event:
			| React.FormEvent<HTMLFormElement>
			| React.FocusEvent<HTMLInputElement, Element>,
		todo: Todo,
	): void => {
		event.preventDefault();
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
					onSubmit={(event) => {
						handleSubmit(event, todo);
					}}>
					<div className='flex items-center justify-center'>
						{!showEdit ? (
							<div
								className={`mb-1 mr-2 mt-1 flex-1 truncate px-4 py-2 text-base ${
									(todo.complete as boolean) ? 'text-gray-400' : 'text-gray-700'
								}`}
								style={{ cursor: 'pointer' }}
								onClick={(e) => {
									setEdit([true, todo.id as number]);
									setNewTodoEdit((old) => ({ ...old, title: todo.title }));
								}}>
								<span className='h-6'>{todo.title}</span>
							</div>
						) : (
							<div className='mr-2 flex flex-1 items-start justify-start border-0'>
								<input
									type='text'
									className='mb-1 mt-1 h-10 w-full bg-white text-base text-gray-700'
									name='title'
									value={newTodoEdit.title}
									onBlur={(event) => {
										handleSubmit(event, todo);
									}}
									onChange={(event) => {
										setNewTodoEdit((old) => ({
											...old,
											title: event.target.value,
										}));
									}}
									autoFocus></input>
							</div>
						)}

						{(edit[0] as boolean) && edit[1] === todo.id && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className=''>
										<button
											className='flex items-center justify-center text-sky-500 hover:text-sky-600'
											type='submit'
											style={{ cursor: 'pointer', display: 'inline' }}>
											<Edit2 size={'1.4rem'} />
										</button>
									</TooltipTrigger>
									<TooltipContent className='bg-sky-500'>
										<p className='font-bold text-white'>Save</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className='mt-0 flex justify-start pb-2 pt-0 text-sm text-gray-400'>
						<div className='mr-2 flex min-w-[20%] max-w-fit items-start justify-start'>
							<Badge
								variant='outline'
								className={`auto py-0.5 text-xs font-normal ${
									todo.priority === 1
										? 'bg-rose-200'
										: todo.priority === 2
										? 'bg-amber-200'
										: todo.priority === 3
										? 'bg-sky-200'
										: 'bg-white'
								} `}>
								P: {PriorityEnumRev[todo.priority as number]}
							</Badge>
						</div>
						<div className='w-fit text-center'>
							{todo.dueDate !== undefined ? (
								<div className='flex items-start justify-start text-gray-600'>
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
