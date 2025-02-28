import React, { useEffect, useMemo } from 'react';
import TaskForm from './taskform';
import TaskListHeader from './taskheader';
import TaskList from './tasklist';
import type { TaskViewProps, filterType } from '../../lib/customTypes';
import { viewData } from '../../lib/userSettings';

export default function TaskView({
	todos,
	lists,
	showSidebar,
	currentView,
	setTodos,
	addTodo,
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
}: TaskViewProps): React.JSX.Element {
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
				content.classList.toggle('is-open');
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

	const listTodos = useMemo(() => {
		if (typeof currentView.id === 'number') {
			return todos.filter((todo) => todo.list === currentView.id);
		} else {
			const customFilter = viewData.viewTagFilters.get(currentView.id);
			return todos.filter(customFilter as filterType);
		}
	}, [todos, currentView]);

	const todosTodo = useMemo(() => {
		const filteredTodos = listTodos.filter((todo) => todo.complete === false);

		return filteredTodos.sort(
			(a, b) => (a.priority as number) - (b.priority as number),
		);
	}, [todos, currentView]);

	const todosCompleted = useMemo(() => {
		let filteredTodos = listTodos.filter((todo) => todo.complete === true);
		if (currentView.id === '1t') {
			filteredTodos = filteredTodos.filter(
				(todo) =>
					todo.completedAt?.toDateString() === new Date().toDateString(),
			);
		}
		return filteredTodos.sort(
			(a, b) =>
				new Date(b.completedAt as Date).valueOf() -
				new Date(a.completedAt as Date).valueOf(),
		);
	}, [todos, currentView]);

	return (
		<div
			className={`relative my-6 duration-300 ease-in-out ${
				showSidebar ? 'w-65%' : 'w-full'
			} rounded-xl border-2 border-black bg-white p-10 fill-mode-forwards`}
			id='taskView'>
			<div
				className='absolute left-3 top-2 text-sm font-bold text-violet-600'
				id='currentView-title'>
				{currentView.title +
					(currentView.id === '1t'
						? ': ' +
						  new Date().toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric',
						  })
						: '') +
					(currentView.archived ? ' (Archived)' : '')}
			</div>
			<TaskForm addTodo={addTodo} key={currentView.id} />
			<TaskListHeader
				fieldDone={'Todo'}
				fieldTask={'Task'}
				fieldActions={'Actions'}
				isComplete={true}
				items={todosTodo.length}
			/>
			<TaskList
				todos={todosTodo}
				lists={lists}
				setTodos={setTodos}
				toggleTodo={toggleTodo}
				deleteTodo={deleteTodo}
				editTodo={editTodo}
				editTodoFull={editTodoFull}
				isComplete={false}
			/>
			<TaskListHeader
				fieldDone={`Completed`}
				fieldTask={''}
				fieldActions={''}
				isComplete={false}
				items={todosCompleted.length}
			/>
			<TaskList
				todos={todosCompleted}
				lists={lists}
				setTodos={setTodos}
				toggleTodo={toggleTodo}
				deleteTodo={deleteTodo}
				editTodo={editTodo}
				editTodoFull={editTodoFull}
				isComplete={true}
			/>
		</div>
	);
}
