import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { ArchiveAdd } from "iconsax-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverClose,
} from "../ui/popover";
import type { CreateModalListProps } from "../../lib/customTypes";

export default function CreateModalList({
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
                <ArchiveAdd size="1.8rem" />
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
