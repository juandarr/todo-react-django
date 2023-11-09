import React, { useState } from 'react';

import type { TaskListProps, filterType } from '../../lib/customTypes';
import TaskItem from './taskitem';
import { viewData } from '../../lib/userSettings';

export default function TaskList({
	todos,
	lists,
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
	isComplete,
	currentView,
	newTodoEdit,
	setNewTodoEdit,
}: TaskListProps): React.JSX.Element {
	const [edit, setEdit] = useState<[boolean, number]>([false, 0]);

	let listTodos;
	if (typeof currentView.id === 'number') {
		listTodos = todos.filter((todo) => todo.list === currentView.id);
	} else {
		const customFilter = viewData.viewTagFilters.get(currentView.id);
		listTodos = todos.filter(customFilter as filterType);
	}

	let filteredTodos = listTodos.filter((todo) => todo.complete === isComplete);
	if (isComplete) {
		filteredTodos = filteredTodos.sort(
			(a, b) =>
				new Date(b.completedAt as Date).valueOf() -
				new Date(a.completedAt as Date).valueOf(),
		);
	} else {
		filteredTodos = filteredTodos.sort(
			(a, b) => (a.priority as number) - (b.priority as number),
		);
	}

	const taskList = filteredTodos.map((todo, idx: number) => {
		return (
			<li key={todo.id} id={`item-${todo.id}`}>
				<TaskItem
					todo={todo}
					lists={lists}
					toggleTodo={toggleTodo}
					editTodo={editTodo}
					editTodoFull={editTodoFull}
					deleteTodo={deleteTodo}
					edit={edit}
					setEdit={setEdit}
					newTodoEdit={newTodoEdit}
					setNewTodoEdit={setNewTodoEdit}
				/>
			</li>
		);
	});

	return (
		<div className={`content mb-3 ${isComplete ? 'inactive max-h-0' : ''}`}>
			{filteredTodos.length === 0 ? (
				<div className='text-md flex-1 px-6 py-6 font-bold text-violet-600'>
					No todos {isComplete ? 'completed yet' : 'at the moment'}
				</div>
			) : (
				<ul className='divide-gray-150 divide-y'>{taskList}</ul>
			)}
		</div>
	);
}
