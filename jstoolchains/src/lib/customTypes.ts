import type { List, Todo } from "../../../todo-api-client/models";

export type ReactSetState = React.Dispatch<
  React.SetStateAction<[boolean, number]>
>;

export type todoType = {
  id?: number;
  title: string;
  description?: string;
  complete?: boolean;
  createdAt?: Date;
  priority?: string;
  list?: string;
};

export type todosType = todoType[];

export type listType = {
  id: number;
  title: string;
  archived: boolean;
};

export type listsType = listType[];

export type userSettingsType = {
  homeListId: number;
};

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
  isTodoModalOpen: boolean;
}

export interface TaskItemProps {
  todo: todoType;
  toggleTodo: (id: number, complete: boolean) => void;
  editTodo: (id: number, title: string, setEdit: ReactSetState) => void;
  deleteTodo: (id: number) => Promise<void>;
  edit: (number | boolean)[];
  setEdit: React.Dispatch<React.SetStateAction<(number | boolean)[]>>;
  newTodoEdit: todoType;
  setNewTodoEdit: React.Dispatch<React.SetStateAction<todoType>>;
  handleKeyPress: (
    event: React.FormEvent<HTMLFormElement>,
    todo: todoType,
  ) => void;
}

export interface TaskListProps {
  todos: todosType;
  toggleTodo: (id: number, complete: boolean) => void;
  deleteTodo: (id: number) => Promise<void>;
  editTodo: (id: number, title: string, setEdit: ReactSetState) => void;
  condition: boolean;
  currentList: listType;
  newTodoEdit: todoType;
  setNewTodoEdit: React.Dispatch<React.SetStateAction<todoType>>;
}

export interface TaskListHeaderProps {
  fieldDone: string;
  fieldTask: string;
  fieldActions: string;
}

export interface CreateModalTodoProps {
  lists: listType[];
  addTodo: addTodoType;
  newTodo: todoType;
  setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
  setIsTodoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CreateModalListProps {
  addList: addListType;
  newList: string;
  setNewList: React.Dispatch<React.SetStateAction<string>>;
}

export interface EditModalListProps {
  editList: (id: number, title: string) => void;
  data: { id: number; title: string };
  newListEdit: string;
  setNewListEdit: React.Dispatch<React.SetStateAction<string>>;
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
  lists: listsType;
  userSettings: userSettingsType;
  changeCurrentList: (oldList: number) => void;
  currentList: listType;
  addList: addListType;
  deleteList: (id: number) => void;
  editList: (id: number, title: string) => void;
  newList: string;
  setNewList: React.Dispatch<React.SetStateAction<string>>;
  newListEdit: string;
  setNewListEdit: React.Dispatch<React.SetStateAction<string>>;
}
