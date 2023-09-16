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
  const [newTodoEdit, setNewTodoEdit] = useState<todoType | null>(null);
  const [newListEdit, setNewListEdit] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
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
          return result.find(
            (list) => list.id == userSettings.homeListId,
          ) as listType;
        });
      })
      .catch(() => {
        console.log("There was an error retrieving lists");
      });
  }, []);

  const changeCurrentList = (newListId: number) => {
    const newList = lists.find((list) => list.id == newListId);
    setCurrentList((oldList) => newList);
    setNewTodo({ title: "", description: "" });
  };

  //FIXME: function to create, update, delete should return an exit message and upon success we can close the popover, it should include notification of success or failure
  /* Progress:
    [x] create List
    [x] create Todo modal
    [x] create Todo taskView
    [x] Delete List
    [x] Delete Todo
    [x] Edit List
    [ ] Edit todo
    [ ] Toggle todo
    */
  // setTimeout(() => {
  //   const value = Math.random();
  //   if (value > 0.5) {
  //     closePopover();
  //   } else {
  //     setError("Invented error");
  //     setStatus("viewing");
  //   }
  // }, 2000);
  const addList = async (title: string) => {
    let list = {
      title: title,
    };
    try {
      const listCreated = await clientList.listsCreate({ list });
      console.log("List was created!", listCreated);
      setLists((oldLists) => [...oldLists, listCreated]);
      return listCreated;
    } catch (error) {
      console.log("List creation failed with error: ", error);
      throw new Error(error);
    }
  };

  const addTodo = async (todo: todoType, origin: string) => {
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
    try {
      const todoCreated = await clientTodo.todosCreate({ todo: todoFiltered });
      console.log("Todo was created!");
      setTodos((oldTodos) => [...oldTodos, todoCreated]);
      return todoCreated;
    } catch (error) {
      console.log("Todo creation failed with error: ", error);
      throw new Error(error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await clientTodo.todosDestroy({ id });
      setTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== id);
      });
      console.log("Todo was deleted");
    } catch (error) {
      console.log("Error deleting todo");
      throw new Error(error);
    }
  };

  //FIXME: the goal is to be able to remove lists even when they have associated tasks.
  const deleteList = async (id: number) => {
    try {
      await clientList.listsDestroy({ id });
      setLists((prevLists) => {
        return prevLists.filter((list) => list.id !== id);
      });
      if (id == currentList.id) {
        setCurrentList((oldList) => {
          return lists.find((list) => list.id == userSettings.homeListId);
        });
      }
      console.log("List was deleted");
    } catch (error) {
      console.log("Error deleting list");
      throw new Error(error);
    }
  };

  const editList = async (id: number, title: string) => {
    let list = {
      title: title,
    };

    try {
      const updatedList = await clientList.listsPartialUpdate({
        id: id,
        patchedList: list,
      });
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
        console.log("Patched list and current list match! ", title);
        setCurrentList((oldCurrentList) => ({ ...oldCurrentList, title }));
      }
      return updatedList;
    } catch (error) {
      console.log("There was an error updating the field");
      throw new Error(error);
    }
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

  const toggleTodo = async (id: number, complete: boolean) => {
    let todo = {
      complete: complete,
    };

    let [x, y] = getPoint("checkbox-" + id);
    try {
      const updatedTodo = await clientTodo.todosPartialUpdate({
        id: id,
        patchedTodo: todo,
      });
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
      return updatedTodo;
    } catch (error) {
      console.log("There was an error toggling the todo");
      throw new Error(error);
    }
  };

  return (
    <>
      <NavBar
        changeCurrentList={changeCurrentList}
        lists={lists}
        addTodo={addTodo}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
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
          newListEdit={newListEdit}
          setNewListEdit={setNewListEdit}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
        <div
          className={`relative my-6 ${
            showSidebar ? "w-8/12" : "w-full"
          } rounded-xl border-2 border-black bg-white p-10`}
        >
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
