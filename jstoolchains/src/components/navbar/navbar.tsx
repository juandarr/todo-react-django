import React, { useState } from "react";
import CreateModalTodo from "../modals/createModalTodo";
import { SidebarLeft, SidebarRight, House, Notification } from "iconsax-react";

import { NavBarProps } from "../../lib/customTypes";
import { userSettings } from "../../lib/userSettings";

export default function NavBar({
  changeCurrentList,
  lists,
  addTodo,
  showSidebar,
  setShowSidebar,
}: NavBarProps) {
  return (
    <nav className="mx-6 mb-6 mt-12 flex w-5/6 justify-between rounded-lg border-2 border-black bg-white p-2">
      <div
        className="flex w-1/12 justify-start pl-3 text-2xl"
        onClick={() =>
          setShowSidebar((old) => {
            return !old;
          })
        }
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
