import React from 'react';

import type { TaskListProps } from '../../lib/customTypes';
import TaskItem from './taskitem';

export default function TaskList({
	todos,
	lists,
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
	isComplete,
}: TaskListProps): React.JSX.Element {
	const taskList = todos.map((todo, idx: number) => {
		return (
			<li key={todo.id} id={`item-${todo.id}`}>
				<TaskItem
					todo={todo}
					lists={lists}
					toggleTodo={toggleTodo}
					editTodo={editTodo}
					editTodoFull={editTodoFull}
					deleteTodo={deleteTodo}
				/>
			</li>
		);
	});

	return (
		<div className={`content mb-3 ${isComplete ? 'inactive max-h-0' : ''}`}>
			{todos.length === 0 ? (
				<div className='text-md flex-1 px-6 py-6 font-bold text-violet-600'>
					No todos {isComplete ? 'completed yet' : 'at the moment'}
				</div>
			) : (
				<ul className='divide-gray-150 divide-y'>{taskList}</ul>
			)}
		</div>
	);
}
