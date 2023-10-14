import React, { useState } from 'react';
import TaskForm from './taskform';
import TaskListHeader from './taskheader';
import TaskList from './tasklist';
import { type Todo } from '../../../../todo-api-client/models';
import type { TaskViewProps } from '../../lib/customTypes';

export default function TaskView({
	todos,
	lists,
	showSidebar,
	currentView,
	addTodo,
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
}: TaskViewProps): React.JSX.Element {
	const [newTodoEdit, setNewTodoEdit] = useState<Todo>({ title: '' });

	return (
		<div
			className={`relative my-6 duration-300 ease-in-out ${
				showSidebar ? 'w-65%' : 'w-full'
			} rounded-xl border-2 border-black bg-white p-10 fill-mode-forwards`}>
			<div className='absolute left-3 top-2 text-sm font-bold text-violet-600'>
				{currentView.title}
			</div>
			<TaskForm addTodo={addTodo} key={currentView.id} />
			<TaskListHeader
				fieldDone={'Done?'}
				fieldTask={'Task'}
				fieldActions={'Actions'}
			/>
			<TaskList
				todos={todos}
				lists={lists}
				toggleTodo={toggleTodo}
				deleteTodo={deleteTodo}
				editTodo={editTodo}
				editTodoFull={editTodoFull}
				condition={false}
				currentView={currentView}
				newTodoEdit={newTodoEdit}
				setNewTodoEdit={setNewTodoEdit}
			/>
			<TaskListHeader
				fieldDone={'Completed'}
				fieldTask={''}
				fieldActions={''}
			/>
			<TaskList
				todos={todos}
				lists={lists}
				toggleTodo={toggleTodo}
				deleteTodo={deleteTodo}
				editTodo={editTodo}
				editTodoFull={editTodoFull}
				condition={true}
				currentView={currentView}
				newTodoEdit={newTodoEdit}
				setNewTodoEdit={setNewTodoEdit}
			/>
		</div>
	);
}
