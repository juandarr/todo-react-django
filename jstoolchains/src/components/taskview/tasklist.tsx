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
		<div className={`content mb-3 ${isComplete ? '' : 'is-open'}`}>
			{todos.length === 0 ? (
				<div className='inner'>
					<div className='text-md flex-1 px-6 pt-6 font-bold text-violet-600'>
						No todos {isComplete ? 'completed yet' : 'at the moment'}
					</div>
				</div>
			) : (
				<ul className='inner divide-gray-150 divide-y'>{taskList}</ul>
			)}
		</div>
	);
}
