import React, { useState, useEffect } from 'react';

import { TodosApi, ListsApi } from '../../todo-api-client/apis/index';
import { Configuration } from '../../todo-api-client/runtime';

import { getPoint, getCookie, isDescendantOf } from './lib/utils';

import NavBar from './components/navbar/navbar';
import SideBar from './components/sidebar/sidebar';
import TaskForm from './components/taskview/taskform';
import TaskListHeader from './components/taskview/taskheader';
import TaskList from './components/taskview/tasklist';

import { userSettings } from './lib/userSettings';

import confetti from 'canvas-confetti';
import { Toaster } from './components/ui/toast/toaster';

import type {
	todoType,
	listType,
	EditionSetState,
	viewType,
} from './lib/customTypes';

import type { Todo, List } from '../../todo-api-client/models';

function randomInRange(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

export default function App(): React.JSX.Element {
	// TODO : review exposure modifications to the DOM done without refs in the codebase. Are any changes being done to the DOM
	const [todos, setTodos] = useState<Todo[]>([]);
	const [lists, setLists] = useState<List[]>([]);
	// Views can be lists or tags, such as today or upcoming
	const [currentView, setCurrentView] = useState<viewType>({
		id: 0,
		title: '',
	});
	const [newTodoEdit, setNewTodoEdit] = useState<Todo>({ title: '' });
	const [newListEdit, setNewListEdit] = useState('');
	const [showSidebar, setShowSidebar] = useState(true);

	const toggleSidebarCallback = (event: KeyboardEvent): void => {
		if (!isDescendantOf(event.target as HTMLElement, 'form')) {
			if (event.key === 's') {
				event.preventDefault();
				setShowSidebar((old) => !old);
			}
		}
	};

	// TODO: Reset forms using keys instead of hardcode it every time (specially for forms)
	// https://react.dev/learn/preserving-and-resetting-state#resetting-a-form-with-a-key
	useEffect(() => {
		document.addEventListener('keydown', toggleSidebarCallback);
		return () => {
			document.removeEventListener('keydown', toggleSidebarCallback);
		};
	}, [toggleSidebarCallback]);

	const apiConfig = new Configuration({
		basePath: 'http://127.0.0.1:8000',
		headers: {
			'X-CSRFToken': getCookie('csrftoken'),
		},
	});

	const clientTodo = new TodosApi(apiConfig);
	const clientList = new ListsApi(apiConfig);

	useEffect(() => {
		clientTodo
			.todosList()
			.then((result) => {
				console.log('Here are the todos: ', result);
				setTodos(result);
			})
			.catch(() => {
				console.log('There was an error retrieving todos');
			});

		console.log('calling clientList now');

		clientList
			.listsList()
			.then((result) => {
				console.log('Here are the lists: ', result);
				setLists(result);
				setCurrentView((oldView) => {
					let tmp: viewType;
					if (typeof userSettings.homeListId === 'number') {
						const list = result.find(
							(list) => list.id === userSettings.homeListId,
						) as listType;
						tmp = { id: list.id, title: list.title };
					} else {
						const homeId = userSettings.homeListId;

						tmp = {
							id: homeId,
							title: userSettings.viewTagDetails.get(homeId) as string,
						};
					}
					return tmp;
				});
			})
			.catch(() => {
				console.log('There was an error retrieving lists');
			});
	}, []);

	const changeCurrentList = (newListId: number | string): void => {
		let newView: viewType;
		if (typeof newListId === 'number') {
			const newList: List = lists.find((list) => list.id === newListId) as List;
			newView = { id: newList.id as number, title: newList.title };
		} else {
			newView = {
				id: newListId,
				title: userSettings.viewTagDetails.get(newListId) as string,
			};
		}
		setCurrentView(newView);
	};

	const addList = async (title: string): Promise<List> => {
		const list = {
			title,
		};
		try {
			const listCreated = await clientList.listsCreate({ list });
			console.log('List was created!', listCreated);
			setLists((oldLists) => [...oldLists, listCreated]);
			return listCreated;
		} catch (error) {
			console.log('List creation failed with error: ', error);
			throw error;
		}
	};

	const addTodo = async (todo: todoType, origin: string): Promise<Todo> => {
		const tmp: { priority: number; list: number; dueDate: Date | undefined } = {
			priority: 4,
			list: 0,
			dueDate: undefined,
		};
		if ('priority' in todo) {
			tmp.priority = parseInt(todo.priority as string);
		}
		if ('list' in todo) {
			tmp.list = parseInt(todo.list as string);
		} else {
			if (origin === 'taskList') {
				if (typeof currentView.id === 'number') {
					tmp.list = currentView.id;
				} else {
					tmp.list = userSettings.inboxListId;
				}
			} else {
				tmp.list = userSettings.inboxListId;
			}
		}
		if ('dueDate' in todo) {
			tmp.dueDate = todo.dueDate as Date;
		} else {
			if (currentView.id === userSettings.viewTags.get('today')) {
				tmp.dueDate = new Date();
			}
		}
		const todoFiltered: Todo = { ...todo, ...tmp };
		try {
			const todoCreated = await clientTodo.todosCreate({ todo: todoFiltered });
			console.log('Todo was created!');
			setTodos((oldTodos) => [...oldTodos, todoCreated]);
			return todoCreated;
		} catch (error) {
			console.log('Todo creation failed with error: ', error);
			throw error;
		}
	};

	const deleteTodo = async (id: number): Promise<void> => {
		try {
			await clientTodo.todosDestroy({ id });
			setTodos((prevTodos) => {
				return prevTodos.filter((todo) => todo.id !== id);
			});
			console.log('Todo was deleted');
		} catch (error) {
			console.log('Error deleting todo');
			throw error;
		}
	};

	const deleteList = async (id: number): Promise<void> => {
		try {
			await clientList.listsDestroy({ id });
			setLists((prevLists) => {
				return prevLists.filter((list) => list.id !== id);
			});
			// If current view is the one being deleted, default current view to the home view
			if (id === currentView.id) {
				setCurrentView(() => {
					const list = lists.find(
						(list) => list.id === userSettings.homeListId,
					) as List;
					return { id: list.id as number, title: list.title };
				});
			}
			console.log('List was deleted');
		} catch (error) {
			console.log('Error deleting list');
			throw error;
		}
	};

	const editList = async (id: number, title: string): Promise<List> => {
		const list = {
			title,
		};

		try {
			const updatedList = await clientList.listsPartialUpdate({
				id,
				patchedList: list,
			});
			console.log('List was patched!');

			setLists((prevLists) => {
				return prevLists.map((list) => {
					if (list.id === id) {
						return { ...list, title };
					} else {
						return list;
					}
				});
			});
			// If the current view is the one being edited, update the current view
			if (id === currentView.id) {
				console.log('Patched list and current list match! ', title);
				setCurrentView((oldCurrentView) => ({ ...oldCurrentView, title }));
			}
			return updatedList;
		} catch (error) {
			console.log('There was an error updating the field in List');
			throw error;
		}
	};

	const toggleTodo = async (id: number, complete: boolean): Promise<Todo> => {
		const todo = {
			complete,
		};

		const [x, y] = getPoint('checkbox-' + id);
		try {
			const updatedTodo = await clientTodo.todosPartialUpdate({
				id,
				patchedTodo: todo,
			});
			if (complete) {
				confetti({
					angle: randomInRange(55, 125),
					spread: randomInRange(50, 70),
					particleCount: randomInRange(50, 100),
					origin: { x, y },
				})?.catch((error) => {
					console.log(error);
				});
			}
			console.log('Todo was toggled!');
			setTodos((prevTodos) => {
				return prevTodos.map((todo) => {
					if (todo.id === id) {
						return updatedTodo;
					} else {
						return todo;
					}
				});
			});
			return updatedTodo;
		} catch (error) {
			console.log('There was an error toggling the todo');
			throw error;
		}
	};

	const editTodoFull = async (todo: todoType): Promise<Todo> => {
		const tmpTodo: Todo = {
			...todo,
			list: parseInt(todo.list as string),
			priority: parseInt(todo.priority as string),
			dueDate: todo.dueDate !== undefined ? todo.dueDate : null,
		};
		try {
			const todoUpdated = await clientTodo.todosPartialUpdate({
				id: todo.id as number,
				patchedTodo: tmpTodo,
			});
			console.log('Todo was patched!');
			setTodos((prevTodos) => {
				return prevTodos.map((prevTodo) => {
					if (prevTodo.id === todo.id) {
						return todoUpdated;
					} else {
						return prevTodo;
					}
				});
			});
			return todoUpdated;
		} catch (error) {
			console.log('There was an error updating the field in Todo');
			throw error;
		}
	};

	const editTodo = async (
		id: number,
		title: string,
		setEdit: EditionSetState,
	): Promise<void> => {
		const todo = {
			title,
		};

		try {
			await clientTodo.todosPartialUpdate({ id, patchedTodo: todo });
			console.log('Todo was patched!');
			setTodos((prevTodos) => {
				return prevTodos.map((todo) => {
					if (todo.id === id) {
						return { ...todo, title };
					} else {
						return todo;
					}
				});
			});
			setEdit([false, 0]);
		} catch (error) {
			console.log('There was an error updating the field in Todo');
			throw error;
		}
	};

	return (
		<>
			<NavBar
				changeCurrentList={changeCurrentList}
				lists={lists}
				addTodo={addTodo}
				setShowSidebar={setShowSidebar}
			/>
			<div className='font-serif relative mx-6 flex w-5/6 justify-end'>
				<SideBar
					lists={lists}
					userSettings={userSettings}
					changeCurrentList={changeCurrentList}
					currentView={currentView}
					addList={addList}
					deleteList={deleteList}
					editList={editList}
					newListEdit={newListEdit}
					setNewListEdit={setNewListEdit}
					showSidebar={showSidebar}
				/>
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
			</div>
			<Toaster />
		</>
	);
}
