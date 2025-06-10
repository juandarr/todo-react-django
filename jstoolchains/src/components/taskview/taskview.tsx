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
	editListOrder,
	showSidebar,
	currentView,
	addTodo,
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
	isLoadingTodos // Add isLoading here
}: TaskViewProps): React.JSX.Element {
	const editListHandler = async (
		id: number,
		tmpList: { ordering: { order: number[] } }
	): Promise<void> => {
		try {
			const updatedList = await editListOrder(id, tmpList);
			console.log('Updated ordering of list: ', updatedList);
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error updating the list ordering: ',
					description: error.message
				});
			}
		}
	};

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
		if (currentView.id === userInfo.inboxListId + 1) {
			customFilter = (todo: Todo) => {
				const tmp = new Date();
				const tomorrow =
					new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()).getTime() +
					24 * 60 * 60 * 1000;
				return (todo.dueDate?.getTime() as number) < tomorrow;
			};
		}
		// Current view is upcoming view
		else if (currentView.id === userInfo.inboxListId + 2) {
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

		const currentList = lists.filter((list) => list.id === currentView.id);
		if (currentList.length !== 0 && !isLoadingTodos) {
			console.log('This is the current list: ', currentList);
			console.log(
				'And here is the ordering: ',
				currentList[0].ordering,
				currentList[0].ordering?.order.length === 0
			);
			const tmp = filteredTodos.map((todo) => todo.id) as number[];
			if (currentList[0].ordering?.order.length === 0 && tmp.length > 0) {
				console.log('Order of todos: ', tmp);
				//Store initial order of todos. Implement such operation here
				editListHandler(currentView.id, { ordering: { order: tmp } })
					.then(() => {})
					.catch(() => {});
			} else {
				//If order is already defined, check existence of todos. Remove the ones not present from ordering array, add new ones to the end, store new ordering array
				//compare current list to sorted one, new todos won´t be on sorted, add to the end
				const order = [...currentList[0].ordering?.order];
				const toRemove = [];
				const toAdd = [];
				let change = false;
				for (let i = 0; i < order.length; i++) {
					if (!tmp.includes(order[i])) {
						toRemove.push(order[i]);
						change = true;
					}
				}
				for (let i = 0; i < tmp.length; i++) {
					if (!order.includes(tmp[i])) {
						toAdd.push(tmp[i]);
						change = true;
					}
				}
				console.log(
					'Current fetched order: ',
					tmp,
					' And stored order: ',
					order
				);
				// Remove values
				let idx;
				for (let i = 0; i < toRemove.length; i++) {
					idx = order.indexOf(toRemove[i]);
					order.splice(idx, 1);
				}
				// Add values
				console.log(
					'Here is what is going to be added: ',
					toAdd,
					' and removed: ',
					toRemove
				);
				order.push(...toAdd);
				console.log('The value of change is: ', change);
				if (change) {
					console.log('New order: ', order);
					editListHandler(currentView.id, { ordering: { order: order } })
						.then(() => {})
						.catch(() => {});
				}
				return order.map((id) =>
					filteredTodos.find((todo) => todo.id === id)
				) as Todo[];
			}
		}

		return filteredTodos;
	}, [todos, currentView]);

	const todosCompleted = useMemo(() => {
		let filteredTodos = listTodos.filter((todo) => todo.complete === true);
		if (currentView.id === userInfo.inboxListId + 1) {
			filteredTodos = filteredTodos.filter(
				(todo) => todo.completedAt?.toDateString() === new Date().toDateString()
			);
		}
		return filteredTodos.sort(
			(a, b) =>
				new Date(b.completedAt as Date).valueOf() -
				new Date(a.completedAt as Date).valueOf()
		);
	}, [todos, currentView]);

	return (
		<div
			className={`relative my-6 duration-300 ease-in-out ${
				showSidebar ? 'w-full md:w-65%' : 'w-full'
			} rounded-xl border-2 border-black bg-white p-10 fill-mode-forwards`}
			id='taskView'>
			<div
				className='absolute left-3 top-2 text-sm font-bold text-violet-600'
				id='currentView-title'>
				{currentView.title +
					(currentView.id === userInfo.inboxListId + 1
						? ': ' +
							new Date().toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric'
							})
						: '') +
					(currentView.id === userInfo.inboxListId + 2
						? ': ' +
							new Date(
								new Date().getTime() + 24 * 60 * 60 * 1000
							).toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric'
							}) +
							', and beyond'
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
			{isLoadingTodos ? (
				<p className='text-center text-gray-500'>Loading todos...</p>
			) : (
				<TaskList
					todos={todosTodo}
					lists={lists}
					editListHandler={editListHandler}
					currentView={currentView}
					userInfo={userInfo}
					toggleTodo={toggleTodo}
					deleteTodo={deleteTodo}
					editTodo={editTodo}
					editTodoFull={editTodoFull}
					isComplete={false}
				/>
			)}
			<TaskListHeader
				fieldDone={`Completed`}
				fieldTask={''}
				fieldActions={''}
				isComplete={false}
				items={todosCompleted.length}
			/>
			{isLoadingTodos ? (
				<p className='text-center text-gray-500'>Loading todos...</p>
			) : (
				<TaskList
					todos={todosCompleted}
					lists={lists}
					editListHandler={editListHandler}
					currentView={currentView}
					userInfo={userInfo}
					toggleTodo={toggleTodo}
					deleteTodo={deleteTodo}
					editTodo={editTodo}
					editTodoFull={editTodoFull}
					isComplete={true}
				/>
			)}
		</div>
	);
}
