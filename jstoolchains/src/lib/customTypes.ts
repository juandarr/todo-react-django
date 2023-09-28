import type { List, Todo } from '../../../todo-api-client/models';

export type EditionSetState = React.Dispatch<
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

export interface userSettingsType {
	homeListId: number;
	todayListId: number;
}

export interface cssTailVariant {
	list: string;
	todo: string;
	[key: string]: string;
}
export type addTodoType = (todo: todoType, origin: string) => Promise<Todo>;
export type addListType = (title: string) => Promise<List>;

export interface TaskFormProps {
	addTodo: addTodoType;
	newTodo: todoType;
	setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
}

export interface TaskItemProps {
	todo: Todo;
	lists: List[];
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	editTodo: (
		id: number,
		title: string,
		setEdit: EditionSetState,
	) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	edit: Array<number | boolean>;
	setEdit: EditionSetState;
	newTodoEdit: Todo;
	setNewTodoEdit: React.Dispatch<React.SetStateAction<Todo>>;
}

export interface TaskListProps {
	todos: Todo[];
	lists: List[];
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	editTodo: (
		id: number,
		title: string,
		setEdit: EditionSetState,
	) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
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

export interface EditModalTodoProps {
	editTodoFull: (todo: todoType) => Promise<Todo>;
	todo: Todo;
	lists: List[];
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

export interface DatePickerProps {
	newTodo: todoType;
	setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
}
