import React, { useState } from 'react';

import type { TaskItemProps } from '../../lib/customTypes';

import { Checkbox } from '../ui/checkbox';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { PriorityEnumRev } from '../../lib/userSettings';
import DeleteModal from '../modals/deleteModal';
import { Trash, Edit2 } from 'iconsax-react';
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
	handleKeyPress,
}: TaskItemProps): React.JSX.Element {
	const [error, setError] = useState<string | null>(null);

	const showEdit = (edit[0] as boolean) && edit[1] === todo.id;

	async function toggleHandler(checked: boolean): Promise<void> {
		console.log('toggled');
		try {
			await toggleTodo(todo.id as number, checked);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
		}
	}

	const deleteElement = (
		<a
			id='deleteTodo'
			className='h-7 w-7 text-rose-400 hover:text-rose-500'
			style={{ cursor: 'pointer', display: 'inline' }}>
			<Trash size={'1.8rem'} />
		</a>
	);

	return (
		<>
			<div className='parent flex'>
				<div className='flex w-1/5 items-center justify-center'>
					<Checkbox
						id={'checkbox-' + todo.id}
						checked={todo.complete}
						onCheckedChange={(checked) => {
							toggleHandler(checked as boolean).catch((error) => {
								console.log('Error found while toggling task: ', error);
							});
						}}
						className='border-2 border-black'
					/>
				</div>
				<form
					className='font-serif relative flex w-3/5 justify-start'
					onSubmit={(event) => {
						handleKeyPress(event, todo);
					}}>
					{!showEdit ? (
						<div
							className={`flex-1 truncate py-2 text-lg ${
								(todo.complete as boolean) ? 'text-gray-400' : 'text-gray-700'
							}`}
							style={{ cursor: 'pointer' }}
							onClick={(e) => {
								setEdit([true, todo.id as number]);
								setNewTodoEdit((old) => ({ ...old, title: todo.title }));
							}}>
							{todo.title}
						</div>
					) : (
						<input
							type='text'
							className='mr-2 flex-1 border-0 bg-white py-2 text-lg text-gray-700'
							name='title'
							value={newTodoEdit.title}
							onChange={(event) => {
								setNewTodoEdit((old) => ({
									...old,
									title: event.target.value,
								}));
							}}
							autoFocus></input>
					)}

					{(edit[0] as boolean) && edit[1] === todo.id && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className=''>
									<a
										className='flex items-center justify-center text-sky-500 hover:text-sky-600'
										style={{ cursor: 'pointer', display: 'inline' }}
										onClick={() => {
											editTodo(todo.id as number, newTodoEdit.title, setEdit)
												.then(() => {})
												.catch(() => {});
										}}>
										<Edit2 size={'1.4rem'} />
									</a>
								</TooltipTrigger>
								<TooltipContent className='bg-sky-500'>
									<p className='font-bold text-white'>Save</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</form>
				<div
					id={`todo-${todo.id}`}
					className='hidden-child flex w-1/5 justify-center py-2'>
					<EditModalTodo
						editTodoFull={editTodoFull}
						todo={todo}
						lists={lists}
						parentId={`todo-${todo.id}`}
						key={`edit-${todo.id}`}
					/>
					<DeleteModal
						deleteFunction={deleteTodo}
						triggerElement={deleteElement}
						deleteEntity={'todo'}
						parentId={`todo-${todo.id}`}
						id={todo.id as number}
						key={`del-${todo.id}`}
					/>
				</div>
			</div>
			<div className='mt-0 flex justify-start pb-2 pt-0 text-sm text-gray-400'>
				<div className='w-1/5'></div>
				<div className='flex w-1/5 items-center justify-start'>
					<Badge
						variant='outline'
						className={`mr-3 h-2 w-6/12 p-3 ${
							todo.priority === 1
								? 'bg-rose-200'
								: todo.priority === 2
								? 'bg-amber-200'
								: todo.priority === 3
								? 'bg-sky-200'
								: 'bg-white'
						} `}>
						{PriorityEnumRev[todo.priority as number]}
					</Badge>
				</div>
				<div className='w-3/5 text-center'>
					<div
						className={`underline ${
							(todo.complete as boolean)
								? 'text-gray-400 decoration-green-500'
								: 'text-gray-600 decoration-rose-500'
						}`}>
						{(todo.complete as boolean)
							? 'Completion: ' +
							  (todo.completedAt as Date).toDateString() +
							  ' ' +
							  (todo.completedAt as Date).toLocaleTimeString()
							: 'Creation: ' +
							  (todo.createdAt as Date).toDateString() +
							  ' ' +
							  (todo.createdAt as Date).toLocaleTimeString()}
					</div>
				</div>
			</div>

			{error != null && (
				<div className='ml-12 text-sm font-bold text-red-500'>
					There was an error during toggle: {error}
				</div>
			)}
		</>
	);
}
