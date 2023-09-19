import type { List, Todo } from '../../../todo-api-client/models';

export type ReactSetState = React.Dispatch<
	React.SetStateAction<[boolean, number]>
>;

export interface todoType {
	id?: number;
	title: string;
	description?: string;
	complete?: boolean;
	completeAt?: Date;
	createdAt?: Date;
	priority?: string;
	list?: string;
}

export type todosType = todoType[];

export interface listType {
	id: number;
	title: string;
	archived: boolean;
}

export type listsType = listType[];

export interface userSettingsType {
	homeListId: number;
}

export type addTodoType = (todo: todoType, origin: string) => Promise<Todo>;
export type addListType = (title: string) => Promise<List>;

export interface cssTailVariant {
	list: string;
	todo: string;
	[key: string]: string;
}
export interface TaskFormProps {
	addTodo: addTodoType;
	newTodo: todoType;
	setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
}

export interface TaskItemProps {
	todo: Todo;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	editTodo: (id: number, title: string, setEdit: ReactSetState) => void;
	deleteTodo: (id: number) => Promise<void>;
	edit: Array<number | boolean>;
	setEdit: React.Dispatch<React.SetStateAction<Array<number | boolean>>>;
	newTodoEdit: Todo;
	setNewTodoEdit: React.Dispatch<React.SetStateAction<Todo>>;
	handleKeyPress: (event: React.FormEvent<HTMLFormElement>, todo: Todo) => void;
}

export interface TaskListProps {
	todos: Todo[];
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	editTodo: (id: number, title: string, setEdit: ReactSetState) => void;
	condition: boolean;
	currentList: List;
	newTodoEdit: Todo;
	setNewTodoEdit: React.Dispatch<React.SetStateAction<Todo>>;
}

export interface TaskListHeaderProps {
	fieldDone: string;
	fieldTask: string;
	fieldActions: string;
}

export interface CreateModalTodoProps {
	lists: Todo[];
	addTodo: addTodoType;
}

export interface CreateModalListProps {
	addList: addListType;
}

export interface EditModalListProps {
	editList: (id: number, title: string) => Promise<List>;
	listData: { id: number; title: string };
	parentId: string;
}

export interface DeleteModalProps {
	deleteFunction: (id: number) => Promise<void>;
	triggerElement: React.JSX.Element;
	deleteEntity: string;
	parentId: string;
	id: number;
}

export interface SideBarProps {
	lists: List[];
	userSettings: userSettingsType;
	changeCurrentList: (oldList: number) => void;
	currentList: List;
	addList: addListType;
	deleteList: (id: number) => Promise<void>;
	editList: (id: number, title: string) => Promise<List>;
	newListEdit: string;
	setNewListEdit: React.Dispatch<React.SetStateAction<string>>;
	showSidebar: boolean;
}

export interface NavBarProps {
	changeCurrentList: (oldList: number) => void;
	lists: List[];
	addTodo: addTodoType;
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
