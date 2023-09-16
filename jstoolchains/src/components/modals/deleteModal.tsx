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
  const [status, setStatus] = useState("viewing");
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      await deleteFunction(id);
      closePopover();
    } catch (error) {
      setError(error);
      setStatus("viewing");
    }
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
          setStatus("viewing");
          setError(null);
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
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 disabled:bg-cyan-100"
              disabled={status === "submitting" ? true : false}
            >
              Yes
            </button>
            <PopoverClose asChild={true}>
              <button
                className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-500 disabled:bg-rose-100"
                disabled={status === "submitting" ? true : false}
              >
                Cancel
              </button>
            </PopoverClose>
          </div>
          {error != null && (
            <div className="text-sm text-red-400">
              There was an error in {deleteEntity} deletion: {error}
            </div>
          )}
        </form>
        <PopoverArrow className={`${fillColorVariants[deleteEntity]}`} />
      </PopoverContent>
    </Popover>
  );
}
