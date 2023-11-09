import type {
	List,
	Todo,
	User,
	Setting,
} from '../../../todo-api-client/models';

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
	id: number | undefined;
	username: string;
	inboxListId: number;
	homeListId: number | string;
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

export type settingModelFetch = [
	Setting[],
	React.Dispatch<React.SetStateAction<Setting[]>>,
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
	isComplete: boolean;
	currentView: viewType;
	newTodoEdit: Todo;
	setNewTodoEdit: React.Dispatch<React.SetStateAction<Todo>>;
}

export interface TaskListHeaderProps {
	fieldDone: string;
	fieldTask: string;
	fieldActions: string;
	isComplete: boolean;
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

export interface SettingsModalProps {
	lists: List[];
	settings: Setting[];
	editSetting: (id: number, value: string) => Promise<void>;
}
export interface GoalsModalProps {
	todos: Todo[];
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
