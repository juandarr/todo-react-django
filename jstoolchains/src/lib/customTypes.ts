import { ActionDispatch, HTMLProps } from 'react';
import type {
	List,
	Todo,
	User,
	Setting
} from '../../../todo-api-client/models';

import { Emoji } from 'frimousse';

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
	boolean
];

export type listModelFetch = [
	List[],
	React.Dispatch<React.SetStateAction<List[]>>,
	boolean
];

export type settingModelFetch = [
	Setting[],
	React.Dispatch<React.SetStateAction<Setting[]>>,
	boolean
];
export type userModelFetch = [
	User[],
	React.Dispatch<React.SetStateAction<User[]>>,
	boolean
];

export interface TaskViewProps {
	userInfo: userInfoType;
	todos: Todo[];
	lists: List[];
	editListOrder: (
		id: number,
		newList: {
			ordering: {
				order: number[];
			};
		}
	) => Promise<List>;
	showSidebar: boolean;
	currentView: viewType;
	addTodo: (todo: todoType, origin: string) => Promise<Todo>;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	editTodo: (id: number, title: string) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
	isLoadingTodos: boolean; // Add isLoading prop
}

export interface TaskFormProps {
	addTodo: addTodoType;
}

export interface SortableTaskItemProps {
	todo: Todo;
	lists: List[];
	userInfo: userInfoType;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	editTodo: (id: number, title: string) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	draggingItemId: number | null; // Add the new prop type here
	isOverlayItem?: boolean; // Indicate if the item is rendered in DragOverlay
	isDragAndDropEnabled: boolean; // Add this prop to control drag handle visibility
}

export interface TaskItemProps {
	todo: Todo;
	lists: List[];
	userInfo: userInfoType;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	editTodo: (id: number, title: string) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
}

export interface TaskListProps {
	todos: Todo[];
	lists: List[];
	editListHandler: (
		id: number,
		tmpList: {
			ordering: {
				order: number[];
			};
		}
	) => Promise<void>;
	currentView: viewType;
	userInfo: userInfoType;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	editTodo: (id: number, title: string) => Promise<void>;
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
	lists: List[];
	userInfo: userInfoType;
	addTodo: addTodoType;
}

export interface TextEditorProps extends HTMLProps<HTMLDivElement> {
	todoDescription: string | undefined;
	charLimit: number;
	isDisabled: boolean;
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
		}
	) => Promise<List>;
	listData: { id: number; title: string; archived: boolean };
	parentId: string;
	deleteFunction: (id: number) => Promise<void>;
}

export interface EditModalTodoProps {
	editTodoFull: (todo: todoType) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	todo: Todo;
	lists: List[];
	parentId: string;
	userInfo: userInfoType;
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
		}
	) => Promise<List>;
	listData: { id: number; title: string; archived: boolean };
}
export interface SettingsModalProps {
	isWindowWidthMedium: boolean;
	lists: List[];
	settings: Setting[];
	editSetting: (id: number, value: string) => Promise<void>;
}
export interface PasswordChangeModalProps {
	isWindowWidthMedium: boolean;
	onClose: () => void;
}
export interface LogoutModalProps {
	isWindowWidthMedium: boolean;
}
export interface GoalsModalProps {
	todos: Todo[];
}

export interface ProfileModalProps {
	isWindowWidthMedium: boolean;
	settings: Setting[];
	editSetting: (id: number, value: string) => Promise<void>;
	lists: List[];
}

type actionType = {
	type: string;
	payload?: any;
};

export interface SideBarProps {
	lists: List[];
	currentView: viewType;
	changeCurrentView: (viewId: number) => void;
	addList: addListType;
	deleteList: (id: number) => Promise<void>;
	editList: (
		id: number,
		newList: {
			title?: string;
			archived?: boolean;
		}
	) => Promise<List>;
	showSidebar: boolean;
	dispatchLists: ActionDispatch<[action: actionType]>;
	isLoadingLists: boolean; // Add isLoadingLists prop
	sidebarRef: React.RefObject<HTMLDivElement | null>;
}

export interface SortableListItemProps {
	list: List;
	currentView: viewType;
	changeCurrentView: (viewId: number) => void;
	deleteList: (id: number) => Promise<void>;
	editList: (
		id: number,
		newList: {
			title?: string;
			archived?: boolean;
		}
	) => Promise<List>;
	dispatchLists: ActionDispatch<[action: actionType]>;
	draggingItemId: number | null;
}

export interface NavBarProps {
	changeCurrentView: (viewId: number) => void;
	lists: List[];
	todos: Todo[];
	userInfo: userInfoType;
	addTodo: addTodoType;
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
	settings: Setting[];
	editSetting: (id: number, value: string) => Promise<void>;
	menuButtonRef: React.RefObject<HTMLDivElement | null>;
	isWindowWidthMedium: boolean;
}

export interface DatePickerProps {
	newTodo: todoType;
	setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
	isDisabled: boolean;
}

export interface MyEmojiPickerProps {
	onEmojiSelect: ({ emoji }: Emoji) => void;
}
