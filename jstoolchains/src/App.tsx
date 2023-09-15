import React, { useState, useEffect } from "react";

import { TodosApi, ListsApi } from "../../todo-api-client/apis/index";
import { Configuration } from "../../todo-api-client/runtime";

import { getPoint, getCookie } from "./lib/utils";

import NavBar from "./components/navbar/navbar";
import SideBar from "./components/sidebar/sidebar";
import TaskForm from "./components/taskview/taskform";
import TaskListHeader from "./components/taskview/taskheader";
import TaskList from "./components/taskview/tasklist";

import { userSettings } from "./lib/userSettings";

import confetti from "canvas-confetti";

import type { todoType, listType, ReactSetState } from "./lib/customTypes";

var myCanvas = document.createElement("canvas");

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
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
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
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

  async function addList(title: string) {
    try {
      let list = {
        title: title,
      };

      const listCreated = await clientList.listsCreate({ list });
      console.log("List was created!", listCreated);
      setLists((oldLists) => [...oldLists, listCreated]);
      return listCreated;
    } catch (error) {
      console.log("List creation failed with error: ", error);
      throw new Error(error);
    }
  }

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
        setIsTodoModalOpen={setIsTodoModalOpen}
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
            isTodoModalOpen={isTodoModalOpen}
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
