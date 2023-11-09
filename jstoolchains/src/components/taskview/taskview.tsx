import React, { useEffect, useState } from 'react';
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

	useEffect(() => {
		const coll = document.getElementsByClassName('collapsible');

		const handleClick = (event: any): void => {
			if (event.target instanceof Element) {
				let el = event.target;
				while (!(el.classList.contains('collapsible') as boolean)) {
					el = el.parentElement;
				}
				el.classList.toggle('active');
				const content = el.parentElement.parentElement
					.nextElementSibling as HTMLElement;
				if (content.style.maxHeight !== '') {
					content.style.maxHeight = '';
				} else {
					content.style.maxHeight = content.scrollHeight + 'px';
				}
			}
		};

		for (let i = 0; i < coll.length; i++) {
			coll[i].addEventListener('click', handleClick);
		}
		return () => {
			for (let i = 0; i < coll.length; i++) {
				coll[i].removeEventListener('click', handleClick);
			}
		};
	}, []);

	useEffect(() => {
		const contents = document.getElementsByClassName('content');
		for (let i = 0; i < contents.length; i++) {
			if ((contents[i] as HTMLElement).style.maxHeight !== '') {
				(contents[i] as HTMLElement).style.maxHeight =
					contents[i].scrollHeight + 'px';
			}
		}
		console.log('Triggered because current view or todos changed!');
	}, [currentView, todos]);

	return (
		<div
			className={`relative my-6 duration-300 ease-in-out ${
				showSidebar ? 'w-65%' : 'w-full'
			} rounded-xl border-2 border-black bg-white p-10 fill-mode-forwards`}>
			<div className='absolute left-3 top-2 text-sm font-bold text-violet-600'>
				{currentView.title +
					(currentView.id === '1t'
						? ': ' +
						  new Date().toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric',
						  })
						: '')}
			</div>
			<TaskForm addTodo={addTodo} key={currentView.id} />
			<TaskListHeader
				fieldDone={'Todo'}
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
				fieldDone={`Completed`}
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
