import React, { useState } from "react";

import { DeleteModalProps, cssTailVariant } from "../../lib/customTypes";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverClose,
} from "../ui/popover";

export default function DeleteModal({
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
