import type { List, Todo, User } from '../../../todo-api-client/models';

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

export type filterType = (todo: Todo) => boolean;

export interface userInfoType {
	id: number;
	username: string;
	homeListId: number | string;
	inboxListId: number;
}

export interface viewDataType {
	viewTags: Map<string, string>;
	viewTagIds: string[];
	viewTagDetails: Map<string, string>;
	viewTagFilters: Map<string, filterType>;
}

export interface viewType {
	id: number | string;
	title: string;
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

export type userModelFetch = [
	User[],
	React.Dispatch<React.SetStateAction<User[]>>,
];

export interface TaskViewProps {
	todos: Todo[];
	lists: List[];
	showSidebar: boolean;
	currentView: viewType;
	addTodo: (todo: todoType, origin: string) => Promise<Todo>;
	toggleTodo: (id: number, complete: boolean) => Promise<Todo>;
	deleteTodo: (id: number) => Promise<void>;
	editTodo: (
		id: number,
		title: string,
		setEdit: EditionSetState,
	) => Promise<void>;
	editTodoFull: (todo: todoType) => Promise<Todo>;
}

export interface TaskFormProps {
	addTodo: addTodoType;
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
	currentView: viewType;
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
	deleteEntity: string;
	parentId: string;
	id: number;
	size: number;
}

export interface SideBarProps {
	lists: List[];
	viewData: viewDataType;
	currentView: viewType;
	changeCurrentView: (viewId: number | string) => void;
	addList: addListType;
	deleteList: (id: number) => Promise<void>;
	editList: (id: number, title: string) => Promise<List>;
	showSidebar: boolean;
}

export interface NavBarProps {
	changeCurrentView: (viewId: number | string) => void;
	lists: List[];
	addTodo: addTodoType;
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DatePickerProps {
	newTodo: todoType;
	setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
}
