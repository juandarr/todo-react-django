import React, { useState, useEffect, useRef, useReducer } from 'react';

import { clientUser, clientTodo, clientList } from './lib/api';

import { getPoint, isDescendantOf } from './lib/utils';

import NavBar from './components/navbar/navbar';
import SideBar from './components/sidebar/sidebar';

import { viewData } from './lib/userSettings';

import confetti from 'canvas-confetti';
import { Toaster } from './components/ui/toast/toaster';

import type {
	todoType,
	listType,
	userInfoType,
	EditionSetState,
	viewType,
	todoModelFetch,
	userModelFetch,
	listsType,
} from './lib/customTypes';

import type { Todo, List } from '../../todo-api-client/models';

import { useModelFetch } from './hooks/useModelFetch';
import TaskView from './components/taskview/taskview';
import listsReducer from './reducers/listsReducer';

function randomInRange(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

let userInfo: userInfoType = {
	id: 0,
	username: '',
	homeListId: 0,
	inboxListId: 0,
};

const initialListsState: listsType = [];

export default function App(): React.JSX.Element {
	// Views can be lists or tags, such as today or upcoming
	const [currentView, setCurrentView] = useState<viewType>({
		id: 0,
		title: '',
	});
	const [newListEdit, setNewListEdit] = useState('');
	const [showSidebar, setShowSidebar] = useState(true);

	const [todos, setTodos]: todoModelFetch = useModelFetch(
		clientTodo.todosList(),
	);

	const [user]: userModelFetch = useModelFetch(clientUser.usersList());

	const [lists, dispatch] = useReducer(listsReducer, initialListsState);

	const initializationCompleted = useRef(false);

	// Initialization effects
	// This effect initializes the userInfo configuration
	useEffect(() => {
		if (user.length !== 0) {
			const tmp = user[0];
			userInfo = {
				id: tmp.id,
				username: tmp.username,
				inboxListId: tmp.inboxId as number,
				homeListId: tmp.inboxId as number,
			};
		}
	}, [user]);
	// Load lists - need to do this since changed from useState to useReducer
	useEffect(() => {
		let ignore = false;
		clientList
			.listsList()
			.then((result: List[]) => {
				if (!ignore) {
					dispatch({
						type: 'added',
						payload: result,
					});
				}
			})
			.catch((error: Error) => {
				if (error instanceof Error) {
					console.log('There was an error retrieving data: ', error.message);
				}
			});

		return () => {
			ignore = true;
		};
	}, []);
	// This effect initializes the currentView based on the homeList userInfo configuration and the initial list of List data. Runs only once
	useEffect(() => {
		if (
			!initializationCompleted.current &&
			userInfo.id !== 0 &&
			lists.length !== 0
		) {
			setCurrentView((oldView) => {
				let tmp: viewType;
				if (typeof userInfo.homeListId === 'number') {
					const list = lists.find(
						(list) => list.id === userInfo.homeListId,
					) as listType;
					tmp = { id: list.id, title: list.title };
				} else {
					const homeId = userInfo.homeListId;

					tmp = {
						id: homeId,
						title: viewData.viewTagDetails.get(homeId) as string,
					};
				}
				return tmp;
			});
			initializationCompleted.current = true;
		}
	}, [user, lists]);

	// Toggles sidebar using 's' key as long as the focus is not on an
	// HTMLElement with a form as an ancestor
	useEffect(() => {
		const toggleSidebarCallback = (event: KeyboardEvent): void => {
			if (!isDescendantOf(event.target as HTMLElement, 'form')) {
				if (event.key === 's') {
					event.preventDefault();
					setShowSidebar((old) => !old);
				}
			}
		};
		document.addEventListener('keydown', toggleSidebarCallback);
		return () => {
			document.removeEventListener('keydown', toggleSidebarCallback);
		};
	}, []);

	const changeCurrentView = (newViewId: number | string): void => {
		let newView: viewType;
		if (typeof newViewId === 'number') {
			const newList: List = lists.find((list) => list.id === newViewId) as List;
			newView = { id: newList.id as number, title: newList.title };
		} else {
			newView = {
				id: newViewId,
				title: viewData.viewTagDetails.get(newViewId) as string,
			};
		}
		setCurrentView(newView);
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
					tmp.list = userInfo.inboxListId;
				}
			} else {
				tmp.list = userInfo.inboxListId;
			}
		}
		if ('dueDate' in todo) {
			tmp.dueDate = todo.dueDate as Date;
		} else {
			if (currentView.id === viewData.viewTags.get('today')) {
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

	const addList = async (title: string): Promise<List> => {
		const list = {
			title,
		};
		try {
			const listCreated = await clientList.listsCreate({ list });
			console.log('List was created!', listCreated);
			dispatch({
				type: 'added',
				payload: listCreated,
			});
			return listCreated;
		} catch (error) {
			console.log('List creation failed with error: ', error);
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

			dispatch({
				type: 'edited',
				payload: updatedList,
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

	const deleteList = async (id: number): Promise<void> => {
		try {
			await clientList.listsDestroy({ id });
			dispatch({
				type: 'deleted',
				payload: { id },
			});
			// If current view is the one being deleted, default current view to the home view
			if (id === currentView.id) {
				setCurrentView(() => {
					if (typeof userInfo.homeListId === 'number') {
						const list = lists.find(
							(list) => list.id === userInfo.homeListId,
						) as List;
						return { id: list.id as number, title: list.title };
					} else {
						return {
							id: userInfo.homeListId,
							title: viewData.viewTagDetails.get(userInfo.homeListId) as string,
						};
					}
				});
			}
			console.log('List was deleted');
		} catch (error) {
			console.log('Error deleting list');
			throw error;
		}
	};

	return (
		<>
			<NavBar
				changeCurrentView={changeCurrentView}
				lists={lists}
				addTodo={addTodo}
				userInfo={userInfo}
				setShowSidebar={setShowSidebar}
			/>
			<div className='relative mx-6 flex w-5/6 justify-end'>
				<SideBar
					lists={lists}
					userInfo={userInfo}
					viewData={viewData}
					changeCurrentView={changeCurrentView}
					currentView={currentView}
					addList={addList}
					deleteList={deleteList}
					editList={editList}
					newListEdit={newListEdit}
					setNewListEdit={setNewListEdit}
					showSidebar={showSidebar}
				/>
				<TaskView
					todos={todos}
					lists={lists}
					showSidebar={showSidebar}
					currentView={currentView}
					addTodo={addTodo}
					toggleTodo={toggleTodo}
					deleteTodo={deleteTodo}
					editTodo={editTodo}
					editTodoFull={editTodoFull}
				/>
			</div>
			<Toaster />
		</>
	);
}
