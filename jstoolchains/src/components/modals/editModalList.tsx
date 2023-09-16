import React, { useState, CSSProperties } from "react";

import { EditModalListProps } from "../../lib/customTypes";
import { Edit } from "iconsax-react";

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

export default function EditModalList({
  editList,
  listData,
  parentId,
}: EditModalListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [listEdit, setListEdit] = useState("");
  const [status, setStatus] = useState("typing");
  const [error, setError] = useState(null);

  const editHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    event.preventDefault();
    if (listEdit == "") return;
    setStatus("submitting");
    try {
      const updatedList = await editList(id, listEdit);
      console.log("Patched list: ", updatedList);
      closePopover();
    } catch (error) {
      setStatus("typing");
      setError(error);
    }
  };

  const closePopover = () => {
    setIsOpen(false);
  };
  const openPopover = () => {
    setListEdit(listData.title);
    setStatus("typing");
    setError(null);
    setIsOpen(true);
  };

  const toggleHidden = () => {
    document.getElementById(parentId).classList.toggle("hidden-child");
  };
  console.log("Modal edit list rendered", isOpen, listEdit, status, error);
  //FIXME: input is highlighted when todo list is open to edit. Cursor should
  //start at the end of text. No highlight expected
  return (
    <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger
            asChild={true}
            className="flex cursor-pointer justify-end pl-2 pr-2 text-2xl text-cyan-500 hover:text-cyan-600"
            onClick={(event) => openPopover()}
          >
            <TooltipTrigger>
              <Edit size={"1.2rem"} />
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-sky-500">
            <p className="font-bold text-white">Edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align={"center"}
        onOpenAutoFocus={(event) => {
          toggleHidden();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          toggleHidden();
        }}
      >
        <form
          id="listform"
          className="font-serif flex flex-col"
          onSubmit={(e) => editHandleSubmit(e, listData.id)}
        >
          <input
            id="listName"
            name="title"
            type="text"
            value={listEdit}
            placeholder="Name this list"
            className="m-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-gray-900 placeholder:text-gray-500"
            onChange={(event) => setListEdit(event.target.value)}
            disabled={status === "submitting" ? true : false}
            required
          />
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 disabled:bg-cyan-200"
              disabled={
                status === "submitting" || listEdit.length === 0 ? true : false
              }
            >
              <Spinner
                color="rgb(147 51 234)"
                loading={status === "submitting"}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <span className={status === "submitting" ? "invisible" : "block"}>
                Edit
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
            <div className="text-sm font-bold text-red-500">
              There was an error editing list: {error}
            </div>
          )}
        </form>
        <PopoverArrow className="fill-sky-500" />
      </PopoverContent>
    </Popover>
  );
}
