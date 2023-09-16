import React from "react";
import CreateModalTodo from "../modals/createModalTodo";
import { SidebarLeft, House, Notification } from "iconsax-react";

import { NavBarProps } from "../../lib/customTypes";
import { userSettings } from "../../lib/userSettings";

export default function NavBar({
  changeCurrentList,
  lists,
  addTodo,
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
      <div className="flex w-8/12 justify-center text-2xl text-emerald-400 hover:text-emerald-500">
        <CreateModalTodo lists={lists} addTodo={addTodo} />
      </div>
      <a
        href="/admin"
        className="flex w-2/12 justify-end pl-3 pr-3 text-2xl text-cyan-500"
      >
        <Notification size="1.8rem" />
      </a>
    </nav>
  );
}
