import React, { useEffect, useMemo } from 'react';
import TaskForm from './taskform';
import TaskListHeader from './taskheader';
import TaskList from './tasklist';
import type { TaskViewProps, filterType } from '../../lib/customTypes';
import type { Todo } from '../../../../todo-api-client/models/Todo';
import { toast } from '../ui/toast/use-toast';

export default function TaskView({
	userInfo,
	todos,
	lists,
	editList,
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
		let customFilter;
		// Current view is today view
		if (currentView.id=== userInfo.inboxListId+1){
			customFilter = (todo: Todo) => {
							const tmp = new Date();
							const tomorrow =
								new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()).getTime() +
								24 * 60 * 60 * 1000;
							return (todo.dueDate?.getTime() as number) < tomorrow;
						};
		}
		// Current view is upcoming view
		else if (currentView.id=== userInfo.inboxListId+2){
			customFilter = (todo: Todo) => {
				const tmp = new Date();
				const tomorrow =
					new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()).getTime() +
					24 * 60 * 60 * 1000;
				return (todo.dueDate?.getTime() as number) >= tomorrow;
			};
		} else {
			customFilter = (todo: Todo) => todo.list === currentView.id;
		}
		
		return todos.filter(customFilter as filterType);
		
	}, [todos, currentView]);

	const todosTodo = useMemo(() => {
		//Todos are by default retrieved by id
		const filteredTodos = listTodos.filter((todo) => todo.complete === false);
		
		// This filter is useful when filtering by priority
		/*
		return filteredTodos.sort(
			(a, b) => (a.priority as number) - (b.priority as number),
		);*/
		return filteredTodos;
	}, [todos]);

	const todosCompleted = useMemo(() => {
		let filteredTodos = listTodos.filter((todo) => todo.complete === true);
		if (currentView.id === (userInfo.inboxListId+1)) {
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
					(currentView.id === (userInfo.inboxListId+1)
						? ': ' +
						  new Date().toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric',
						  })
						: '') + 
						(currentView.id === (userInfo.inboxListId+2)
						? ': ' +
						  new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric',
						  }) + ', and beyond'
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
				editList={editList}
				currentView={currentView}
				userInfo={userInfo}
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
				editList={editList}
				currentView={currentView}
				userInfo={userInfo}
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
