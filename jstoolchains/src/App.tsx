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
} from "iconsax-react";

import confetti from "canvas-confetti";

type ReactSetState = React.Dispatch<React.SetStateAction<[boolean, number]>>;

type todoType = {
  id: number;
  title: string;
  description: string;
  complete: boolean;
  createdAt: Date;
  list: number;
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

type addTodoType = (title: string) => void;

interface TaskFormProps {
  addTodo: addTodoType;
}

interface TaskListProps {
  todos: todosType;
  toggleTodo: (id: number, complete: boolean) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, title: string, setEdit: ReactSetState) => void;
  condition: boolean;
  currentList: listType;
}

interface TaskListHeaderProps {
  fieldDone: string;
  fieldTask: string;
  fieldActions: string;
}

interface NavBarProps {
  changeCurrentList: (oldList: number) => void;
}

interface SideBarProps {
  lists: listsType;
  userSettings: userSettingsType;
  changeCurrentList: (oldList: number) => void;
  currentList: listType;
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const iconSize = "1.8rem";

function NavBar({ changeCurrentList }: NavBarProps) {
  return (
    <nav className="mx-6 mb-6 mt-12 flex w-5/6 justify-between rounded-lg border-2 border-black bg-white p-2">
      <a
        href="/api/lists"
        className="flex w-1/12 justify-start pl-3 text-2xl  text-violet-500"
      >
        <HambergerMenu size={iconSize} />
      </a>
      <a
        className="flex w-1/12 cursor-pointer justify-start pl-3 text-2xl text-rose-400 hover:text-rose-500"
        onClick={() => changeCurrentList(userSettings.homeListId)}
      >
        <House size={iconSize} />
      </a>
      <a
        href="/api/todos"
        className="flex w-8/12 justify-center pl-3 text-2xl text-emerald-500"
      >
        <AddCircle size={iconSize} />
      </a>
      <a
        href="/admin"
        className="flex w-2/12 justify-end pl-3 pr-3 text-2xl text-cyan-500"
      >
        <Notification size={iconSize} />
      </a>
    </nav>
  );
}

function SideBar({
  lists,
  userSettings,
  currentList,
  changeCurrentList,
}: SideBarProps) {
  const otherLists = lists
    .filter((list) => list.id !== userSettings.homeListId)
    .map((list) => (
      <div
        key={list.id}
        className={`cursor-pointer ${
          currentList.id == list.id ? "rounded-md bg-cyan-200" : ""
        } rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
        onClick={() => changeCurrentList(list.id)}
      >
        {list.title}
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
        <div className="flex justify-between">
          <div className="mb-2 text-xl font-bold text-violet-600">Lists</div>
          <a href="/" className="flex justify-center text-2xl text-violet-600">
            <ArchiveAdd size={iconSize} />
          </a>
        </div>
        {otherLists}
      </div>
    </div>
  );
}

function TaskForm({ addTodo }: TaskFormProps) {
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo == "") return;
    addTodo(newTodo);
  };

  return (
    <form
      id="myform"
      className="mb-6 flex space-x-4 font-serif text-lg"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="title"
        className="h-10 flex-1 rounded-xl bg-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500"
        id="todoText"
        onChange={(e) => setNewTodo(e.target.value)}
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
    <div className="text-md flex rounded-xl bg-gray-100 py-3 font-serif font-bold">
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

function TaskList({
  todos,
  toggleTodo,
  deleteTodo,
  editTodo,
  condition,
  currentList,
}: TaskListProps) {
  const [edit, setEdit] = useState([false, 0]);
  const [textEdit, setTextEdit] = useState("");

  const handleKeyPress = (
    event: React.FormEvent<HTMLFormElement>,
    todo: todoType,
  ) => {
    event.preventDefault();
    editTodo(todo.id, textEdit, setEdit);
  };
  const listTodos = todos.filter((todo) => todo.list == currentList.id);
  const filteredTodos = listTodos.filter((todo) => todo.complete == condition);

  if (filteredTodos.length === 0) {
    return (
      <div className="text-md flex-1 px-6 py-6 font-bold text-violet-600">
        No todos {condition == true ? "completed yet" : "at the moment"}
      </div>
    );
  }
  const taskList = filteredTodos.map((todo, idx: number) => {
    const show_edit = edit[0] && edit[1] == todo.id;
    return (
      <li key={todo.id}>
        <form
          className="flex justify-start font-sans"
          onSubmit={(e) => handleKeyPress(e, todo)}
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
                  setTextEdit(todo.title);
                }}
              >
                {todo.title}
              </div>
            ) : (
              <input
                type="text"
                className="flex-1 border-0 bg-white py-2 text-lg text-gray-700"
                name="title"
                value={textEdit}
                onChange={(e) => setTextEdit(e.target.value)}
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
                      onClick={() => editTodo(todo.id, textEdit, setEdit)}
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
          <div className="flex w-1/5 justify-center py-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    onClick={() => deleteTodo(todo.id)}
                    className="h-7 w-7 text-rose-400 hover:text-rose-500"
                    style={{ cursor: "pointer", display: "inline" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </TooltipTrigger>
                <TooltipContent className="bg-rose-400">
                  <p className="font-bold text-white">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
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
      </li>
    );
  });

  return <ul className="divide-gray-150 divide-y">{taskList}</ul>;
}

const PriorityEnum = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};

function getCookie(name: string) {
  var cookieValue = null;
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
  let [xTarget, yTarget] = [target.offsetLeft, target.offsetTop];

  let [xDoc, yDoc] = [window.innerWidth, window.innerHeight];
  return [xTarget / xDoc, yTarget / yDoc];
}

var myCanvas = document.createElement("canvas");
//document.body.appendChild(myCanvas);

const userSettings = {
  homeListId: 1,
};

export default function App() {
  const [isLoading, setIsloading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState({
    id: 0,
    title: "",
    archived: false,
  });

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
  };

  const addTodo = (title: string) => {
    let todo = {
      title: title,
      list: currentList.id,
    };
    clientTodo
      .todosCreate({ todo })
      .then((result) => {
        console.log("Todo was created!");
        const form = (
          document.getElementById("myform") as HTMLFormElement
        ).reset();
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
      <NavBar changeCurrentList={changeCurrentList} />
      <div className="mx-6 flex w-5/6 justify-between font-serif">
        <SideBar
          lists={lists}
          userSettings={userSettings}
          changeCurrentList={changeCurrentList}
          currentList={currentList}
        />
        <div className="relative my-6 w-8/12 rounded-xl border-2 border-black bg-white p-10">
          <div className="absolute left-3 top-2 text-sm font-bold text-violet-600">
            {currentList.title}
          </div>
          <TaskForm addTodo={addTodo} />
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
          />
        </div>
      </div>
    </>
  );
}
