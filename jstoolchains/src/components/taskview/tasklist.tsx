import React, { useState } from 'react';

import type { TaskListProps } from '../../lib/customTypes';
import type { Todo } from '../../../../todo-api-client/models';
import TaskItem from './taskitem';

export default function TaskList({
	todos,
	toggleTodo,
	deleteTodo,
	editTodo,
	condition,
	currentList,
	newTodoEdit,
	setNewTodoEdit,
}: TaskListProps): React.JSX.Element {
	const [edit, setEdit] = useState([false, 0]);

	const handleKeyPress = (
		event: React.FormEvent<HTMLFormElement>,
		todo: Todo,
	): void => {
		event.preventDefault();
		editTodo(todo.id as number, newTodoEdit.title, setEdit);
	};

	const listTodos = todos.filter((todo) => todo.list === currentList.id);
	const filteredTodos = listTodos.filter((todo) => todo.complete === condition);

	if (filteredTodos.length === 0) {
		return (
			<div className='text-md flex-1 px-6 py-6 font-bold text-violet-600'>
				No todos {condition ? 'completed yet' : 'at the moment'}
			</div>
		);
	}
	const taskList = filteredTodos.map((todo, idx: number) => {
		return (
			<li key={todo.id}>
				<TaskItem
					todo={todo}
					toggleTodo={toggleTodo}
					editTodo={editTodo}
					deleteTodo={deleteTodo}
					edit={edit}
					setEdit={setEdit}
					newTodoEdit={newTodoEdit}
					setNewTodoEdit={setNewTodoEdit}
					handleKeyPress={handleKeyPress}
				/>
			</li>
		);
	});

	return <ul className='divide-gray-150 divide-y'>{taskList}</ul>;
}
