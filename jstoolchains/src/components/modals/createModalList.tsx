import React, { useState, CSSProperties } from "react";

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

import Spinner from "react-spinners/DotLoader";

const override: CSSProperties = {
  display: "block",
  position: "absolute",
  justifyContent: "center",
  alignSelf: "center",
};

import type { CreateModalListProps } from "../../lib/customTypes";

export default function CreateModalList({ addList }: CreateModalListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [newList, setNewList] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("typing");

  const createHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (newList == "") return;
    setStatus("submitting");
    try {
      const result = await addList(newList);
      closePopover();
    } catch (error) {
      setError(error);
      setStatus("typing");
    }
  };

  function openPopover() {
    setNewList("");
    setStatus("typing");
    setError(null);
    setIsOpen(true);
  }

  function closePopover() {
    setIsOpen(false);
  }

  console.log("Modal create list rendered", isOpen, newList, error, status);
  return (
    <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger
            asChild={true}
            className="flex cursor-pointer justify-center text-2xl text-violet-500 hover:text-violet-600"
            onClick={(event) => openPopover()}
          >
            <TooltipTrigger>
              <ArchiveAdd size="1.8rem" />
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-violet-500">
            <p className="font-bold text-white">Add list</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align={"center"}
        onOpenAutoFocus={(event) => {}}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
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
            disabled={status === "submitting" ? true : false}
            required
          />
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 disabled:bg-cyan-200"
              disabled={
                newList.length === 0 || status === "submitting" ? true : false
              }
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
                Create
              </span>
            </button>
            <PopoverClose asChild={true}>
              <button
                className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-600 disabled:bg-rose-200"
                disabled={status === "submitting" ? true : false}
              >
                Cancel
              </button>
            </PopoverClose>
          </div>
          {error != null && (
            <div className="text-sm font-bold  text-red-500">
              There was an error creating list: {error}
            </div>
          )}
        </form>
        <PopoverArrow className="fill-violet-500" />
      </PopoverContent>
    </Popover>
  );
}
