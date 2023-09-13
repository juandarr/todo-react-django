import React, { useState, useEffect } from "react";
import { TodosApi, ListsApi } from "../../todo-api-client/apis/index";
import { Configuration } from "../../todo-api-client/runtime";
import { Checkbox } from "./components/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/tooltip";

import {
  HambergerMenu,
  House,
  Notification,
  ArchiveAdd,
  AddCircle,
  Menu,
  Trash,
  Edit,
} from "iconsax-react";

import confetti from "canvas-confetti";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverClose,
} from "./components/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/select";

function getCookie(name: string) {
  var cookieValue = name;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function getPoint(t: string) {
  let target = document.getElementById(t);
  let [xTarget, yTarget] = [
    target.getBoundingClientRect().left,
    target.getBoundingClientRect().top,
  ];

  let [xDoc, yDoc] = [window.innerWidth, window.innerHeight];
  //console.log(xTarget, xDoc, yTarget, yDoc);
  return [xTarget / xDoc, yTarget / yDoc];
}

var myCanvas = document.createElement("canvas");

const userSettings = {
  homeListId: 1,
};

const PriorityEnum = {
  None: "0",
  Low: "1",
  Medium: "2",
  High: "3",
};

type ReactSetState = React.Dispatch<React.SetStateAction<[boolean, number]>>;

type todoType = {
  id?: number;
  title: string;
  description?: string;
  complete?: boolean;
  createdAt?: Date;
  priority?: string;
  list?: string;
};

type todosType = todoType[];

type listType = {
  id: number;
  title: string;
  archived: boolean;
};

type listsType = listType[];

type userSettingsType = {
  homeListId: number;
};

type addTodoType = (todo: todoType, origin: string) => void;

interface cssTailVariant {
  list: string;
  todo: string;
  [key: string]: string;
}
interface TaskFormProps {
  addTodo: addTodoType;
  newTodo: todoType;
  setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
}

interface TaskItemProps {
  todo: todoType;
  toggleTodo: (id: number, complete: boolean) => void;
  editTodo: (id: number, title: string, setEdit: ReactSetState) => void;
  deleteTodo: (id: number) => void;
  edit: (number | boolean)[];
  setEdit: React.Dispatch<React.SetStateAction<(number | boolean)[]>>;
  newTodoEdit: todoType;
  setNewTodoEdit: React.Dispatch<React.SetStateAction<todoType>>;
  handleKeyPress: (
    event: React.FormEvent<HTMLFormElement>,
    todo: todoType,
  ) => void;
}

interface TaskListProps {
  todos: todosType;
  toggleTodo: (id: number, complete: boolean) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, title: string, setEdit: ReactSetState) => void;
  condition: boolean;
  currentList: listType;
  newTodoEdit: todoType;
  setNewTodoEdit: React.Dispatch<React.SetStateAction<todoType>>;
}

interface TaskListHeaderProps {
  fieldDone: string;
  fieldTask: string;
  fieldActions: string;
}

interface CreateModalTodoProps {
  lists: listType[];
  addTodo: addTodoType;
  newTodo: todoType;
  setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
}

interface CreateModalListProps {
  addList: (title: string) => void;
  newList: string;
  setNewList: React.Dispatch<React.SetStateAction<string>>;
}

interface EditModalListProps {
  editList: (id: number, title: string) => void;
  data: { id: number; title: string };
  newListEdit: string;
  setNewListEdit: React.Dispatch<React.SetStateAction<string>>;
  parentId: string;
}

interface DeleteModalProps {
  deleteFunction: (id: number) => void;
  triggerElement: React.JSX.Element;
  deleteEntity: string;
  parentId: string;
  id: number;
}

interface NavBarProps {
  changeCurrentList: (oldList: number) => void;
  lists: listType[];
  addTodo: addTodoType;
  newTodo: todoType;
  setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
}

interface SideBarProps {
  lists: listsType;
  userSettings: userSettingsType;
  changeCurrentList: (oldList: number) => void;
  currentList: listType;
  addList: (title: string) => void;
  deleteList: (id: number) => void;
  editList: (id: number, title: string) => void;
  newList: string;
  setNewList: React.Dispatch<React.SetStateAction<string>>;
  newListEdit: string;
  setNewListEdit: React.Dispatch<React.SetStateAction<string>>;
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const iconSize = "1.8rem";

function NavBar({
  changeCurrentList,
  lists,
  addTodo,
  newTodo,
  setNewTodo,
}: NavBarProps) {
  const toggleSidebar = function () {
    const s = document.getElementById("sidebar");

    if (s.style.display == "none") {
      s.style.display = "block";
    } else {
      s.style.display = "none";
    }
  };
  return (
    <nav className="mx-6 mb-6 mt-12 flex w-5/6 justify-between rounded-lg border-2 border-black bg-white p-2">
      <div
        className="flex w-1/12 justify-start pl-3 text-2xl"
        onClick={toggleSidebar}
      >
        <button className="text-violet-500 hover:text-violet-600">
          <HambergerMenu size={iconSize} />
        </button>
      </div>
      <div
        className="flex w-1/12 justify-start pl-3 text-2xl"
        onClick={() => changeCurrentList(userSettings.homeListId)}
      >
        <button className="text-rose-400 hover:text-rose-500">
          <House size={iconSize} />
        </button>
      </div>
      <CreateModalTodo
        lists={lists}
        addTodo={addTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
      />
      <a
        href="/admin"
        className="flex w-2/12 justify-end pl-3 pr-3 text-2xl text-cyan-500"
      >
        <Notification size={iconSize} />
      </a>
    </nav>
  );
}

function CreateModalTodo({
  lists,
  addTodo,
  newTodo,
  setNewTodo,
}: CreateModalTodoProps) {
  const [isOpen, setIsOpen] = useState(false);
  //TODO: redefine the way the todo object is retrieved and stored. Initially I was
  //working with just the tittle, now we need in addition description, priority and
  //list. Same model should also be useful for a edit button.
  const createHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo.title == "") return;
    addTodo(newTodo, "NavBar");
    closePopover();
  };

  const closePopover = () => {
    setIsOpen(false);
  };
  const openPopover = () => {
    setIsOpen(true);
    setNewTodo({ title: "", description: "" });
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(newOpenState) => setIsOpen(newOpenState)}
    >
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild={true}>
            <TooltipTrigger asChild={true}>
              <div
                className="flex w-8/12 justify-center text-2xl"
                onClick={() => openPopover()}
              >
                <button className="text-emerald-400 hover:text-emerald-500">
                  <AddCircle size={iconSize} />
                </button>
              </div>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-emerald-500">
            <p className="font-bold text-white">Add todo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align={"center"}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          setNewTodo({ title: "", description: "" });
        }}
      >
        <form
          id="listform"
          className="font-serif flex flex-col"
          onSubmit={createHandleSubmit}
        >
          <input
            id="listName"
            name="title"
            type="text"
            value={newTodo.title}
            placeholder="Name this list"
            className="mb-2 ml-4 mr-4 mt-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500"
            onChange={(event) =>
              setNewTodo((old) => ({ ...old, title: event.target.value }))
            }
            required
          />
          <textarea
            id="listDescription"
            name="description"
            value={newTodo.description}
            placeholder="Description"
            className="mb-1 ml-4 mr-4 mt-1 h-28 rounded-xl bg-gray-300 p-2 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500"
            onChange={(event) =>
              setNewTodo((old) => ({ ...old, description: event.target.value }))
            }
          />
          <div className="mb-3 ml-4 mr-4 mt-2 flex items-center justify-start">
            <Select
              value={newTodo.priority}
              onValueChange={(value) =>
                setNewTodo((old) => ({ ...old, priority: value }))
              }
            >
              <SelectTrigger className="mr-3 h-2 w-5/12 p-3 ">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PriorityEnum).map((item, idx) => {
                  return (
                    <SelectItem key={idx} value={item[1]}>
                      {item[0]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              value={newTodo.list}
              onValueChange={(value) => {
                setNewTodo((old) => ({ ...old, list: value }));
              }}
            >
              <SelectTrigger className="h-2 w-5/12 p-3">
                <SelectValue placeholder="List" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id.toString()}>
                    {list.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-400 p-3 text-lg text-black hover:bg-cyan-500"
            >
              Create
            </button>
            <PopoverClose asChild={true}>
              <button className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-rose-400 p-3 text-lg text-black hover:bg-rose-500">
                Cancel
              </button>
            </PopoverClose>
          </div>
        </form>
        <PopoverArrow className="fill-emerald-500" />
      </PopoverContent>
    </Popover>
  );
}

function CreateModalList({
  addList,
  newList,
  setNewList,
}: CreateModalListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newList == "") return;
    addList(newList);
    closePopover();
  };

  const closePopover = () => {
    setIsOpen(false);
  };
  const openPopover = () => {
    setIsOpen(true);
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(newOpenState) => setIsOpen(newOpenState)}
    >
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild={true}>
            <TooltipTrigger>
              <a
                className="flex cursor-pointer justify-center text-2xl text-violet-500 hover:text-violet-600"
                onClick={() => openPopover()}
              >
                <ArchiveAdd size={iconSize} />
              </a>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-violet-500">
            <p className="font-bold text-white">Add list</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align={"center"}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          setNewList("");
        }}
      >
        <form
          id="listform"
          className="font-serif flex flex-col"
          onSubmit={createHandleSubmit}
        >
          <input
            id="listName"
            name="title"
            type="text"
            value={newList}
            placeholder="Name this list"
            className="m-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-gray-900 placeholder:text-gray-500"
            onChange={(event) => setNewList(event.target.value)}
            required
          />
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-400 p-3 text-lg text-black hover:bg-cyan-500"
            >
              Create
            </button>
            <PopoverClose asChild={true}>
              <button className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-rose-400 p-3 text-lg text-black hover:bg-rose-500">
                Cancel
              </button>
            </PopoverClose>
          </div>
        </form>
        <PopoverArrow className="fill-violet-500" />
      </PopoverContent>
    </Popover>
  );
}

function EditModalList({
  editList,
  data,
  newListEdit,
  setNewListEdit,
  parentId,
}: EditModalListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const editHandleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    event.preventDefault();
    console.log(event, id, newListEdit);
    if (newListEdit == "") return;
    editList(id, newListEdit);
    closePopover();
  };

  const closePopover = () => {
    setIsOpen(false);
  };
  const openPopover = () => {
    setIsOpen(true);
  };

  const toggleHidden = () => {
    const el = document.getElementById(parentId);
    el.classList.toggle("hidden-child");
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(newOpenState) => setIsOpen(newOpenState)}
    >
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild={true}>
            <TooltipTrigger>
              <a
                className="flex cursor-pointer justify-end pl-2 pr-2 text-2xl text-cyan-500 hover:text-cyan-600"
                onClick={() => openPopover()}
              >
                <Edit size={"1.2rem"} />
              </a>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-sky-500">
            <p className="font-bold text-white">Edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align={"center"}
        onOpenAutoFocus={() => {
          toggleHidden();
          setNewListEdit(data.title);
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          toggleHidden();
          setNewListEdit("");
        }}
      >
        <form
          id="listform"
          className="font-serif flex flex-col"
          onSubmit={(e) => editHandleSubmit(e, data.id)}
        >
          <input
            id="listName"
            name="title"
            type="text"
            value={newListEdit}
            placeholder="Name this list"
            className="m-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-gray-900 placeholder:text-gray-500"
            onChange={(event) => setNewListEdit(event.target.value)}
            required
          />
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-400 p-3 text-lg text-black hover:bg-cyan-500"
            >
              Edit
            </button>
            <PopoverClose asChild={true}>
              <button className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-rose-400 p-3 text-lg text-black hover:bg-rose-500">
                Cancel
              </button>
            </PopoverClose>
          </div>
        </form>
        <PopoverArrow className="fill-sky-500" />
      </PopoverContent>
    </Popover>
  );
}

function DeleteModal({
  deleteFunction,
  triggerElement,
  deleteEntity,
  parentId,
  id,
}: DeleteModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //FIXME: function to create, update, delete should return an exit message and upon success we can close the popover, it should include notification of success or failure
    deleteFunction(id);
    closePopover();
  };

  const closePopover = () => {
    setIsOpen(false);
  };
  const openPopover = () => {
    setIsOpen(true);
  };

  const toggleHidden = () => {
    const el: HTMLElement = document.getElementById(parentId);
    if (el !== null) el.classList.toggle("hidden-child");
  };

  const fillColorVariants: cssTailVariant = {
    list: "fill-sky-500",
    todo: "fill-rose-500",
  };
  const bgColorVariants: cssTailVariant = {
    list: "bg-sky-500",
    todo: "bg-rose-500",
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(newOpenState) => setIsOpen(newOpenState)}
    >
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild={true}>
            <TooltipTrigger>{triggerElement}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className={`${bgColorVariants[deleteEntity]}`}>
            <p className="font-bold text-white">Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align={"center"}
        onOpenAutoFocus={(event) => toggleHidden()}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          toggleHidden();
        }}
      >
        <form
          id="listform"
          className="font-serif flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="m-4 h-8 rounded-xl p-2 px-4 py-3 text-gray-900">
            Are you sure to delete?
          </div>
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-400 p-3 text-lg text-black hover:bg-cyan-500"
            >
              Yes
            </button>
            <PopoverClose asChild={true}>
              <button className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-rose-400 p-3 text-lg text-black hover:bg-rose-500">
                Cancel
              </button>
            </PopoverClose>
          </div>
        </form>
        <PopoverArrow className={`${fillColorVariants[deleteEntity]}`} />
      </PopoverContent>
    </Popover>
  );
}

function SideBar({
  lists,
  userSettings,
  currentList,
  changeCurrentList,
  addList,
  deleteList,
  editList,
  newList,
  setNewList,
  newListEdit,
  setNewListEdit,
}: SideBarProps) {
  const deleteElement = (
    <a className="flex cursor-pointer justify-end text-2xl text-cyan-500 hover:text-cyan-600">
      <Trash size={"1.2rem"} />
    </a>
  );
  const otherLists = lists
    .filter((list) => list.id !== userSettings.homeListId)
    .map((list) => (
      <div key={list.id} className="parent flex items-center justify-between">
        <div
          className={`flex-1 cursor-pointer ${
            currentList.id == list.id ? "rounded-md bg-cyan-200" : ""
          } truncate rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
          onClick={() => changeCurrentList(list.id)}
        >
          {list.title}
        </div>
        <div
          id={`list-${list.id}`}
          className="hidden-child flex items-center justify-end"
        >
          <EditModalList
            editList={editList}
            newListEdit={newListEdit}
            setNewListEdit={setNewListEdit}
            data={{ id: list.id, title: list.title }}
            parentId={`list-${list.id}`}
          />
          <DeleteModal
            deleteFunction={deleteList}
            triggerElement={deleteElement}
            deleteEntity="list"
            parentId={`list-${list.id}`}
            id={list.id}
          />
        </div>
      </div>
    ));

  return (
    <div
      className="my-6 flex w-3/12 flex-col  rounded-xl border-2 border-black bg-white p-10"
      id="sidebar"
    >
      <div className="mb-1 flex flex-col">
        <div className="mb-2 text-xl font-bold">Tareas</div>
        <div
          className={`cursor-pointer ${
            currentList.id == userSettings.homeListId
              ? "rounded-md bg-cyan-200"
              : ""
          } rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
          onClick={() => changeCurrentList(userSettings.homeListId)}
        >
          Inbox
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="mb-2 flex justify-between">
          <div className="text-xl font-bold text-violet-600">Lists</div>
          <CreateModalList
            addList={addList}
            newList={newList}
            setNewList={setNewList}
          />
        </div>
        {otherLists}
      </div>
    </div>
  );
}

function TaskForm({ addTodo, newTodo, setNewTodo }: TaskFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo.title == "") return;
    addTodo(newTodo, "taskList");
  };

  return (
    <form
      id="myform"
      className="font-serif mb-6 flex space-x-4 text-lg"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="title"
        className="h-10 flex-1 rounded-xl bg-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500"
        id="todoText"
        value={newTodo.title}
        onChange={(e) =>
          setNewTodo((old) => ({ ...old, title: e.target.value }))
        }
        placeholder="Enter your todo here"
        required
      />
      <button
        type="submit"
        className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-400 p-3 text-black hover:bg-cyan-500"
      >
        Add
      </button>
    </form>
  );
}

function TaskListHeader({
  fieldDone,
  fieldTask,
  fieldActions,
}: TaskListHeaderProps) {
  return (
    <div className="text-md font-serif flex rounded-xl bg-gray-100 py-3 font-bold">
      <p className="w-1/5 px-6 text-center font-bold text-gray-700">
        {fieldDone}
      </p>
      <p className="flex-1 px-6 font-bold text-gray-700">{fieldTask}</p>
      <p className="hidden w-1/5 px-6 text-center text-gray-700 md:block">
        {fieldActions}
      </p>
    </div>
  );
}

function TaskItem({
  todo,
  toggleTodo,
  editTodo,
  deleteTodo,
  edit,
  setEdit,
  newTodoEdit,
  setNewTodoEdit,
  handleKeyPress,
}: TaskItemProps) {
  const show_edit = edit[0] && edit[1] == todo.id;

  const deleteElement = (
    <svg
      id="deleteTodo"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="h-7 w-7 text-rose-400 hover:text-rose-500"
      style={{ cursor: "pointer", display: "inline" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <>
      <div className="parent flex justify-between">
        <form
          className="font-serif flex flex-1 justify-start"
          onSubmit={(event) => handleKeyPress(event, todo)}
        >
          <div className="flex w-1/5 items-center justify-center">
            <Checkbox
              id={"checkbox-" + todo.id}
              checked={todo.complete}
              onCheckedChange={(checked) =>
                toggleTodo(todo.id, checked as boolean)
              }
              className="border-2 border-black"
            />
          </div>
          <div className="flex flex-1 truncate">
            {!show_edit ? (
              <div
                className={`py-2 text-lg ${
                  todo.complete ? "text-gray-400" : "text-gray-700"
                }`}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  setEdit([true, todo.id]);
                  setNewTodoEdit((old) => ({ ...old, title: todo.title }));
                }}
              >
                {todo.title}
              </div>
            ) : (
              <input
                type="text"
                className="flex-1 border-0 bg-white py-2 text-lg text-gray-700"
                name="title"
                value={newTodoEdit.title}
                onChange={(event) =>
                  setNewTodoEdit((old) => ({
                    ...old,
                    title: event.target.value,
                  }))
                }
                autoFocus
              ></input>
            )}

            {edit[0] && edit[1] == todo.id && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-2 self-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="h-7 w-7 text-sky-500 hover:text-sky-600"
                      style={{ cursor: "pointer", display: "inline" }}
                      onClick={() =>
                        editTodo(todo.id, newTodoEdit.title, setEdit)
                      }
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                  </TooltipTrigger>
                  <TooltipContent className="bg-sky-500">
                    <p className="font-bold text-white">Save</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </form>
        <div
          id={`todo-${todo.id}`}
          className="hidden-child flex w-1/5 justify-center py-2"
        >
          <DeleteModal
            deleteFunction={deleteTodo}
            triggerElement={deleteElement}
            deleteEntity={"todo"}
            parentId={`todo-${todo.id}`}
            id={todo.id}
          />
        </div>
      </div>
      <div className="ml-6 mt-0 flex justify-start pb-2 pt-0 text-sm text-gray-400">
        <div className="w-2/5 text-center">
          <div
            className={`underline ${
              todo.complete
                ? "text-gray-400 decoration-green-500"
                : "text-gray-600 decoration-rose-500"
            }`}
          >
            {todo.createdAt.toDateString() +
              " " +
              todo.createdAt.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </>
  );
}

function TaskList({
  todos,
  toggleTodo,
  deleteTodo,
  editTodo,
  condition,
  currentList,
  newTodoEdit,
  setNewTodoEdit,
}: TaskListProps) {
  const [edit, setEdit] = useState([false, 0]);

  const handleKeyPress = (
    event: React.FormEvent<HTMLFormElement>,
    todo: todoType,
  ) => {
    event.preventDefault();
    editTodo(todo.id, newTodoEdit.title, setEdit);
  };

  const listTodos = todos.filter(
    (todo) => todo.list == currentList.id.toString(),
  );
  const filteredTodos = listTodos.filter((todo) => todo.complete == condition);

  if (filteredTodos.length === 0) {
    return (
      <div className="text-md flex-1 px-6 py-6 font-bold text-violet-600">
        No todos {condition == true ? "completed yet" : "at the moment"}
      </div>
    );
  }
  const taskList = filteredTodos.map((todo, idx: number) => {
    return (
      <li key={todo.id}>
        <TaskItem
          todo={todo}
          toggleTodo={toggleTodo}
          editTodo={editTodo}
          deleteTodo={deleteTodo}
          edit={edit}
          setEdit={setEdit}
          newTodoEdit={newTodoEdit}
          setNewTodoEdit={setNewTodoEdit}
          handleKeyPress={handleKeyPress}
        />
      </li>
    );
  });

  return <ul className="divide-gray-150 divide-y">{taskList}</ul>;
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState({
    id: 0,
    title: "",
    archived: false,
  });
  const [newTodo, setNewTodo] = useState<todoType>({
    title: "",
    description: "",
  });
  const [newTodoEdit, setNewTodoEdit] = useState<todoType | null>(null);
  const [newList, setNewList] = useState("");
  const [newListEdit, setNewListEdit] = useState("");

  const apiConfig = new Configuration({
    basePath: "http://127.0.0.1:8000",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });

  const clientTodo = new TodosApi(apiConfig);
  const clientList = new ListsApi(apiConfig);

  var myConfetti = confetti.create(myCanvas, {
    resize: true,
    useWorker: true,
  });

  useEffect(() => {
    clientTodo
      .todosList()
      .then((result) => {
        console.log("Here are the todos: ", result);
        setTodos(result);
      })
      .catch(() => {
        console.log("There was an error retrieving todos");
      });

    console.log("calling clientList now");

    clientList
      .listsList()
      .then((result) => {
        console.log("Here are the lists: ", result);
        setLists(result);
        setCurrentList((oldList) => {
          return result.filter(
            (list) => list.id == userSettings.homeListId,
          )[0] as listType;
        });
      })
      .catch(() => {
        console.log("There was an error retrieving lists");
      });
  }, []);

  const changeCurrentList = (newListId: number) => {
    const newList = lists.filter((list) => list.id == newListId)[0];
    setCurrentList((oldList) => newList);
    setNewTodo({ title: "", description: "" });
  };

  const addList = (title: string) => {
    let list = {
      title: title,
    };
    clientList
      .listsCreate({ list })
      .then((result) => {
        console.log("List was created!");
        setNewList("");
        clientList
          .listsList()
          .then((result) => {
            console.log("Here are the lists: ", result);
            setLists(result);
          })
          .catch(() => {
            console.log("There was an error");
          });
      })
      .catch((e) => {
        console.log(e, "List creation failed");
      });
  };

  const addTodo = (todo: todoType, origin: string) => {
    let todoFiltered: any = { ...todo };
    if ("priority" in todo) {
      todoFiltered.priority = parseInt(todoFiltered.priority);
    }
    if ("list" in todo) {
      todoFiltered.list = parseInt(todoFiltered.list);
    } else {
      if (origin == "taskList") {
        todoFiltered.list = currentList.id;
      } else {
        todoFiltered.list = userSettings.homeListId;
      }
    }
    clientTodo
      .todosCreate({ todo: todoFiltered })
      .then((result) => {
        console.log("Todo was created!");
        setNewTodo({
          title: "",
          description: "",
        });
        clientTodo
          .todosList()
          .then((result) => {
            console.log("Here are the todos: ", result);
            setTodos(result);
          })
          .catch(() => {
            console.log("There was an error");
          });
      })
      .catch((e) => {
        console.log(e, "Todo creation failed");
      });
  };

  const toggleTodo = (id: number, complete: boolean) => {
    let todo = {
      complete: complete,
    };
    let [x, y] = getPoint("checkbox-" + id);
    clientTodo
      .todosPartialUpdate({ id: id, patchedTodo: todo })
      .then((result) => {
        if (complete == true) {
          confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { x: x, y: y },
          });
        }
        console.log("Todo was toggled!");
        setTodos((prevTodos) => {
          return prevTodos.map((todo) => {
            if (todo.id == id) {
              return { ...todo, complete };
            } else {
              return todo;
            }
          });
        });
      })
      .catch((error) => {
        console.log("There was an error toggling the todo");
      });
  };

  const deleteList = (id: number) => {
    clientList
      .listsDestroy({ id })
      .then((result) => {
        setLists((prevLists) => {
          return prevLists.filter((list) => list.id !== id);
        });
        if (id == currentList.id) {
          setCurrentList((oldList) => {
            return lists.filter(
              (list) => list.id == userSettings.homeListId,
            )[0] as listType;
          });
        }
        console.log("List was deleted");
      })
      .catch((event) => {
        console.log("Error deleting list");
      });
  };

  const deleteTodo = (id: number) => {
    clientTodo
      .todosDestroy({ id })
      .then((result) => {
        setTodos((prevTodos) => {
          return prevTodos.filter((todo) => todo.id !== id);
        });
        console.log("Todo was deleted");
      })
      .catch((e) => {
        console.log("Error deleting todo");
      });
  };

  const editList = (id: number, title: string) => {
    let list = {
      title: title,
    };
    clientList
      .listsPartialUpdate({ id: id, patchedList: list })
      .then((result) => {
        console.log("List was patched!");
        setLists((prevLists) => {
          return prevLists.map((list) => {
            if (list.id == id) {
              return { ...list, title };
            } else {
              return list;
            }
          });
        });
        if (id === currentList.id) {
          console.log("CUrrent id and current list match! ", title);
          setCurrentList((oldCurrentList) => ({ ...oldCurrentList, title }));
        }
      })
      .catch((error) => {
        console.log("There was an error updating the field");
      });
  };

  const editTodo = (id: number, title: string, setEdit: ReactSetState) => {
    setEdit([false, 0]);
    let todo = {
      title: title,
    };
    clientTodo
      .todosPartialUpdate({ id: id, patchedTodo: todo })
      .then((result) => {
        console.log("Todo was patched!");
        setTodos((prevTodos) => {
          return prevTodos.map((todo) => {
            if (todo.id == id) {
              return { ...todo, title };
            } else {
              return todo;
            }
          });
        });
      })
      .catch((error) => {
        console.log("There was an error updating the field");
      });
  };
  return (
    <>
      <NavBar
        changeCurrentList={changeCurrentList}
        lists={lists}
        addTodo={addTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
      />
      <div className="font-serif mx-6 flex w-5/6 justify-between">
        <SideBar
          lists={lists}
          userSettings={userSettings}
          changeCurrentList={changeCurrentList}
          currentList={currentList}
          addList={addList}
          deleteList={deleteList}
          editList={editList}
          newList={newList}
          setNewList={setNewList}
          newListEdit={newListEdit}
          setNewListEdit={setNewListEdit}
        />
        <div className="relative my-6 w-8/12 rounded-xl border-2 border-black bg-white p-10">
          <div className="absolute left-3 top-2 text-sm font-bold text-violet-600">
            {currentList.title}
          </div>
          <TaskForm
            addTodo={addTodo}
            newTodo={newTodo}
            setNewTodo={setNewTodo}
          />
          <TaskListHeader
            fieldDone={"Is done?"}
            fieldTask={"Task"}
            fieldActions={"Actions"}
          />
          <TaskList
            todos={todos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            condition={false}
            currentList={currentList}
            newTodoEdit={newTodoEdit}
            setNewTodoEdit={setNewTodoEdit}
          />
          <TaskListHeader
            fieldDone={"Completed"}
            fieldTask={""}
            fieldActions={""}
          />
          <TaskList
            todos={todos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            condition={true}
            currentList={currentList}
            newTodoEdit={newTodoEdit}
            setNewTodoEdit={setNewTodoEdit}
          />
        </div>
      </div>
    </>
  );
}
