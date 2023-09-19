import React, { useState } from 'react';

import type { TaskItemProps } from '../../lib/customTypes';

import { Checkbox } from '../ui/checkbox';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import DeleteModal from '../modals/deleteModal';
import { Icon, Trash } from 'iconsax-react';

export default function TaskItem({
	todo,
	toggleTodo,
	editTodo,
	deleteTodo,
	edit,
	setEdit,
	newTodoEdit,
	setNewTodoEdit,
	handleKeyPress,
}: TaskItemProps): React.JSX.Element {
	const [error, setError] = useState(null);

	const showEdit = (edit[0] as boolean) && edit[1] === todo.id;

	async function toggleHandler(checked: boolean): Promise<void> {
		console.log('toggled');
		try {
			await toggleTodo(todo.id as number, checked);
		} catch (error) {
			setError(error);
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
							className='flex-1 border-0 bg-white py-2 text-lg text-gray-700'
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
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth='2'
										stroke='currentColor'
										className='ml-2 h-7 w-7 self-center text-sky-500 hover:text-sky-600'
										style={{ cursor: 'pointer', display: 'inline' }}
										onClick={() => {
											console.log('Now trying to patch something?Looollzzz');
											editTodo(todo.id as number, newTodoEdit.title, setEdit);
										}}>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'
										/>
									</svg>
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
					<DeleteModal
						deleteFunction={deleteTodo}
						triggerElement={deleteElement}
						deleteEntity={'todo'}
						parentId={`todo-${todo.id}`}
						id={todo.id as number}
					/>
				</div>
			</div>
			<div className='ml-6 mt-0 flex justify-start pb-2 pt-0 text-sm text-gray-400'>
				<div className='w-3/5 text-center'>
					<div
						className={`underline ${
							(todo.complete as boolean)
								? 'text-gray-400 decoration-green-500'
								: 'text-gray-600 decoration-rose-500'
						}`}>
						{(todo.createdAt as Date).toDateString() +
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
