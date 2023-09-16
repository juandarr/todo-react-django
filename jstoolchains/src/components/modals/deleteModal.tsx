import React, { useState, CSSProperties } from "react";

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

import Spinner from "react-spinners/DotLoader";

const override: CSSProperties = {
  display: "block",
  position: "absolute",
  justifyContent: "center",
  alignSelf: "center",
};
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
    setStatus("viewing");
    setError(null);
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
  console.log("Delete modal is rendered");
  return (
    <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild={true} onClick={() => openPopover()}>
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
        className="data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]"
      >
        <form
          id="listform"
          className="font-serif flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="m-4 flex h-8 items-center justify-center rounded-xl p-2 px-4 py-3 text-gray-900">
            Are you sure to delete?
          </div>
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 disabled:bg-cyan-100"
              disabled={status === "submitting" ? true : false}
            >
              <Spinner
                color="rgb(8 145 178)"
                loading={status === "submitting"}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <span className={status === "submitting" ? "invisible" : "block"}>
                Yes
              </span>
            </button>
            <PopoverClose asChild={true}>
              <button
                className="flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-500 disabled:bg-rose-100"
                disabled={status === "submitting" ? true : false}
              >
                Cancel
              </button>
            </PopoverClose>
          </div>
          {error != null && (
            <div className="text-sm font-bold text-red-500">
              There was an error in {deleteEntity} deletion: {error}
            </div>
          )}
        </form>
        <PopoverArrow className={`${fillColorVariants[deleteEntity]}`} />
      </PopoverContent>
    </Popover>
  );
}
