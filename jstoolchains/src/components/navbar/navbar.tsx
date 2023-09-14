import React from "react";
import CreateModalTodo from "../modals/createModalTodo";
import { SidebarLeft, House, Notification } from "iconsax-react";

import { todoType, listType, addTodoType } from "../../lib/customTypes";
import { userSettings } from "../../lib/userSettings";

interface NavBarProps {
  changeCurrentList: (oldList: number) => void;
  lists: listType[];
  addTodo: addTodoType;
  newTodo: todoType;
  setNewTodo: React.Dispatch<React.SetStateAction<todoType>>;
  setIsTodoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavBar({
  changeCurrentList,
  lists,
  addTodo,
  newTodo,
  setNewTodo,
  setIsTodoModalOpen,
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
          <SidebarLeft size="1.8rem" />
        </button>
      </div>
      <div
        className="flex w-1/12 justify-start pl-3 text-2xl"
        onClick={() => changeCurrentList(userSettings.homeListId)}
      >
        <button className="text-rose-400 hover:text-rose-500">
          <House size="1.8rem" />
        </button>
      </div>
      <CreateModalTodo
        lists={lists}
        addTodo={addTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        setIsTodoModalOpen={setIsTodoModalOpen}
      />
      <a
        href="/admin"
        className="flex w-2/12 justify-end pl-3 pr-3 text-2xl text-cyan-500"
      >
        <Notification size="1.8rem" />
      </a>
    </nav>
  );
}
