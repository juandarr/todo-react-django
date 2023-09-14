import React, { useState } from "react";

import { EditModalListProps } from "../../lib/customTypes";
import { Edit } from "iconsax-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { AddCircle } from "iconsax-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverClose,
} from "../ui/popover";

export default function EditModalList({
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
