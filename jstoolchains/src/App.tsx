import React, { useState, useEffect, useRef, useReducer } from 'react';

import { clientUser, clientTodo, clientList, clientSetting } from './lib/api';

import { getPoint, isDescendantOf, randomInRange } from './lib/utils';

import NavBar from './components/navbar/navbar';
import SideBar from './components/sidebar/sidebar';

import { viewData } from './lib/userSettings';

import confetti from 'canvas-confetti';
import { Toaster } from './components/ui/toast/toaster';

import type {
	todoType,
	listType,
	userInfoType,
	viewType,
	todoModelFetch,
	userModelFetch,
	settingModelFetch,
	listsType,
} from './lib/customTypes';

import type { Todo, List, Setting } from '../../todo-api-client/models';

import { useModelFetch } from './hooks/useModelFetch';
import TaskView from './components/taskview/taskview';
import listsReducer from './reducers/listsReducer';
import { UserContext } from './contexts/UserContext';

const userInfoInitial: userInfoType = {
	id: 0,
	username: '',
	inboxListId: 0,
	homeListId: 0,
	timeZone: '',
};

const initialListsState: listsType = [];

export default function App(): React.JSX.Element {
	// Views can be lists or tags, such as today or upcoming
	const [currentView, setCurrentView] = useState<viewType>({
		id: 0,
		title: '',
		archived: false,
	});
	const [showSidebar, setShowSidebar] = useState(true);

	const [todos, setTodos]: todoModelFetch = useModelFetch(
		clientTodo.todosList(),
	);

	const [settings, setSettings]: settingModelFetch = useModelFetch(
		clientSetting.settingsList(),
	);

	const [user]: userModelFetch = useModelFetch(clientUser.usersList());
	const [userInfo, setUserInfo] = useState(userInfoInitial);
	const [lists, dispatchLists] = useReducer(listsReducer, initialListsState);

	const initializationCompleted = useRef(false);

	// Initialization effects
	// This effect initializes the userInfo configuration
	// tmp.inboxId as number
	useEffect(() => {
		if (user.length !== 0 && settings.length !== 0) {
			const tmp = user[0];
			const homeView = settings.find(
				(setting) => setting.parameter === 'home_view',
			) as Setting;
			const timeZone = settings.find(
				(setting) => setting.parameter === 'timezone',
			) as Setting;
			setUserInfo({
				id: tmp.id,
				username: tmp.username,
				inboxListId: tmp.inboxId as number,
				homeListId:parseInt(homeView.value),
				timeZone: timeZone.value,
			});
			console.log('This is the homeView: ', homeView, ' with user: ', userInfo);
		}
	}, [user, settings]);

	// Load lists - need to do this since changed from useState to useReducer
	useEffect(() => {
		let ignore = false;
		clientList
			.listsList()
			.then((result: List[]) => {
				if (!ignore) {
					dispatchLists({
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
			console.log('Setting currentView');
			setCurrentView((oldView) => {
				let tmp: viewType;
				
					const list = lists.find(
						(list) => list.id === userInfo.homeListId,
					) as listType;
					tmp = { id: list.id, title: list.title, archived: list.archived };
				
				return tmp;
			});
			initializationCompleted.current = true;
		}
	}, [userInfo, lists]);

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

	const changeCurrentView = (newViewId: number): void => {
		let newView: viewType;
		
		const newList: List = lists.find((list) => list.id === newViewId) as List;
		newView = {
			id: newList.id as number,
			title: newList.title,
			archived: newList.archived as boolean,
		};
	
		const e = document.getElementById('currentView-title');
		e?.classList.remove('fade-in');
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		e?.offsetWidth;
		e?.classList.add('fade-in');
		setCurrentView(() => newView);
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
				if (currentView.id !== userInfo.inboxListId+1 && currentView.id !== userInfo.inboxListId+2) {
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
			if (currentView.id === (userInfo.inboxListId+1)) {
				tmp.dueDate = new Date();
			} else if (currentView.id === (userInfo.inboxListId+2)) {
				const tmpD = new Date();
				tmp.dueDate = new Date(
					new Date(
						tmpD.getFullYear(),
						tmpD.getMonth(),
						tmpD.getDate(),
					).getTime() +
						24 * 60 * 60 * 1000,
				);
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
		setInFocus: React.Dispatch<React.SetStateAction<boolean>>,
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
			setInFocus(false);
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
			dispatchLists({
				type: 'added',
				payload: listCreated,
			});
			return listCreated;
		} catch (error) {
			console.log('List creation failed with error: ', error);
			throw error;
		}
	};

	const editList = async (
		id: number,
		newList: { title?: string; archived?: boolean; ordering?: object },
	): Promise<List> => {
		let list;
		if (newList.archived === undefined) {
			if (newList.ordering === undefined){
				list = {
					title: newList.title,
				};
			} else {
				list = {
					ordering: newList.ordering
				};
			}
		} else {
			list = { archived: newList.archived };
		}

		try {
			const updatedList = await clientList.listsPartialUpdate({
				id,
				patchedList: list,
			});
			console.log('List was patched!');

			dispatchLists({
				type: 'edited',
				payload: updatedList,
			});
			// If the current view is the one being edited, update the current view
			if (id === currentView.id) {
				console.log('Patched list and current list match! ', newList.title);
				const tmp = {
					title:
						newList.title === undefined || currentView.title === newList.title
							? currentView.title
							: newList.title,
					archived:
						newList.archived === undefined ||
						currentView.archived === newList.archived
							? currentView.archived
							: newList.archived,
				};
				setCurrentView((oldCurrentView) => ({
					...oldCurrentView,
					title: tmp.title,
					archived: tmp.archived,
				}));
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
			dispatchLists({
				type: 'deleted',
				payload: { id },
			});
			// If current view is the one being deleted, default current view to the home view
			if (id === currentView.id) {
				setCurrentView(() => {
			
						const list = lists.find(
							(list) => list.id === userInfo.homeListId,
						) as List;
						return {
							id: list.id as number,
							title: list.title,
							archived: list.archived as boolean,
						};
				
				});
			}
			console.log('List was deleted');
		} catch (error) {
			console.log('Error deleting list');
			throw error;
		}
	};

	const editSetting = async (id: number, value: string): Promise<void> => {
		const setting = {
			value,
		};
		console.log('Updating new setting');
		try {
			await clientSetting.settingsPartialUpdate({
				id,
				patchedSetting: setting,
			});
			console.log('Setting was updated!');
			setSettings((prevSettings) => {
				return prevSettings.map((setting) => {
					if (setting.id === id) {
						return { ...setting, value };
					} else {
						return setting;
					}
				});
			});
		} catch (error) {
			console.log('There was an error updating the field in Setting');
			throw error;
		}
	};

	return (
		<>
			<UserContext.Provider value={userInfo}>
				<NavBar
					changeCurrentView={changeCurrentView}
					lists={lists}
					todos={todos}
					userInfo={userInfo}
					addTodo={addTodo}
					setShowSidebar={setShowSidebar}
					settings={settings}
					editSetting={editSetting}
				/>
				<div className='relative mx-6 flex w-5/6 justify-end'>
					<SideBar
						lists={lists}
						dispatchLists={dispatchLists}
						currentView={currentView}
						changeCurrentView={changeCurrentView}
						addList={addList}
						deleteList={deleteList}
						editList={editList}
						showSidebar={showSidebar}
					/>
					<TaskView
						userInfo={userInfo}
						todos={todos}
						lists={lists}
						editList={editList}
						currentView={currentView}
						setTodos={setTodos}
						addTodo={addTodo}
						toggleTodo={toggleTodo}
						deleteTodo={deleteTodo}
						editTodo={editTodo}
						editTodoFull={editTodoFull}
						showSidebar={showSidebar}
					/>
				</div>
				<Toaster />
			</UserContext.Provider>
		</>
	);
}
