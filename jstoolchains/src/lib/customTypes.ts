import { ActionDispatch } from 'react';
import type {
	List,
	Todo,
	User,
	Setting,
} from '../../../todo-api-client/models';

export interface todoType {
	id?: number;
	title: string;
	description?: string;
	complete?: boolean;
	completeAt?: Date;
	createdAt?: Date;
	priority?: string;
	dueDate?: Date | null;
	list?: string;
}

export type todosType = todoType[];

export interface listType {
	id: number;
	title: string;
	archived: boolean;
}

export type listsType = listType[];

export type filterType = (todo: Todo) => boolean;

export interface userInfoType {
	id: number | undefined;
	username: string;
	inboxListId: number;
	homeListId: number;
	timeZone: string;
}

export interface viewDataType {
	views: Array<{ id: string; title: string }>;
	viewTags: Map<string, string>;
	viewTagIds: string[];
	viewTagDetails: Map<string, string>;
	viewTagFilters: Map<string, filterType>;
}

export interface viewType {
	id: number;
	title: string;
	archived: boolean;
}

export interface cssTailVariant {
	list: string;
	todo: string;
	[key: string]: string;
}
export type addTodoType = (todo: todoType, origin: string) => Promise<Todo>;
export type addListType = (title: string) => Promise<List>;

export type todoModelFetch = [
	Todo[],
	React.Dispatch<React.SetStateAction<Todo[]>>,
];

export type listModelFetch = [
	List[],
	React.Dispatch<React.SetStateAction<List[]>>,
];

export type settingModelFetch = [
	Setting[],
	React.Dispatch<React.SetStateAction<Setting[]>>,
];
export type userModelFetch = [
	User[],
	React.Dispatch<React.SetStateAction<User[]>>,
];

export interface TaskViewProps {
	userInfo: userInfoType;
	todos: Todo[];
	lists: List[];
	showSidebar: boolean;
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
	currentView: viewType;
	addTodo: (todo: todoType, origin: string) => Promise<Todo>;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	editTodo: (
		id: number,
		title: string,
		setInFocus: React.Dispatch<React.SetStateAction<boolean>>,
	) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
}

export interface TaskFormProps {
	addTodo: addTodoType;
}

export interface SortableTaskItemProps {
	todo: Todo;
	lists: List[];
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	editTodo: (
		id: number,
		title: string,
		setInFocus: React.Dispatch<React.SetStateAction<boolean>>,
	) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
}

export interface TaskItemProps {
	todo: Todo;
	lists: List[];
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	editTodo: (
		id: number,
		title: string,
		setInFocus: React.Dispatch<React.SetStateAction<boolean>>,
	) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
}

export interface TaskListProps {
	todos: Todo[];
	lists: List[];
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	editTodo: (
		id: number,
		title: string,
		setInFocus: React.Dispatch<React.SetStateAction<boolean>>,
	) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
	isComplete: boolean;
}

export interface TaskListHeaderProps {
	fieldDone: string;
	fieldTask: string;
	fieldActions: string;
	isComplete: boolean;
	items: number;
}

export interface CreateModalTodoProps {
	lists: Todo[];
	addTodo: addTodoType;
}

export interface CreateModalListProps {
	addList: addListType;
}

export interface EditModalListProps {
	editList: (
		id: number,
		newList: {
			title?: string;
			archived?: boolean;
		},
	) => Promise<List>;
	listData: { id: number; title: string; archived: boolean };
	parentId: string;
	deleteFunction: (id: number) => Promise<void>;
}

export interface EditModalTodoProps {
	editTodoFull: (todo: todoType) => Promise<Todo>;
	todo: Todo;
	lists: List[];
	parentId: string;
}
export interface DeleteModalListProps {
	deleteFunction: (id: number) => Promise<void>;
	deleteEntity: string;
	id: number;
	size: number;
}

export interface DeleteModalTodoProps {
	deleteFunction: (id: number) => Promise<void>;
	deleteEntity: string;
	parentId: string;
	id: number;
}

export interface ArchiveModalListProps {
	editFunction: (
		id: number,
		newList: {
			title?: string;
			archived?: boolean;
		},
	) => Promise<List>;
	listData: { id: number; title: string; archived: boolean };
}
export interface SettingsModalProps {
	lists: List[];
	settings: Setting[];
	editSetting: (id: number, value: string) => Promise<void>;
}
export interface GoalsModalProps {
	todos: Todo[];
}

type actionType = {
	type: string;
	payload?: any;
  };

export interface SideBarProps {
	lists: List[];
	currentView: viewType;
	changeCurrentView: (viewId: number | string) => void;
	addList: addListType;
	deleteList: (id: number) => Promise<void>;
	editList: (
		id: number,
		newList: {
			title?: string;
			archived?: boolean;
		},
	) => Promise<List>;
	showSidebar: boolean;
	dispatchLists: ActionDispatch<[action: actionType]>;
}

export interface SortableListItemProps {
	list: List;
	currentView: viewType;
	changeCurrentView: (viewId: number | string) => void;
	deleteList: (id: number) => Promise<void>;
	editList: (
		id: number,
		newList: {
			title?: string;
			archived?: boolean;
		},
	) => Promise<List>;
	dispatchLists: ActionDispatch<[action: actionType]>;
}

export interface NavBarProps {
	changeCurrentView: (viewId: number | string) => void;
	lists: List[];
	todos: Todo[];
	addTodo: addTodoType;
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
	settings: Setting[];
	editSetting: (id: number, value: string) => Promise<void>;
}

export interface DatePickerProps {
	newTodo: todoType;
	setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
	isDisabled: boolean;
}