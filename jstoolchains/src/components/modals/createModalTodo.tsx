import React, { useState, CSSProperties } from "react";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import Spinner from "react-spinners/DotLoader";

const override: CSSProperties = {
  display: "block",
  position: "absolute",
  justifyContent: "center",
  alignSelf: "center",
};

import { CreateModalTodoProps, todoType } from "../../lib/customTypes";
import { PriorityEnum } from "../../lib/userSettings";

export default function CreateModalTodo({
  lists,
  addTodo,
}: CreateModalTodoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTodo, setNewTodo] = useState<todoType>({
    title: "",
    description: "",
  });
  const [status, setStatus] = useState("typing");
  const [error, setError] = useState(null);

  const createHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (newTodo.title == "") return;
    setStatus("submitting");

    try {
      const result = await addTodo(newTodo, "NavBar");
      closePopover();
    } catch (error) {
      setError(error);
      setStatus("typing");
    }
  };

  const closePopover = () => {
    setIsOpen(false);
  };

  const openPopover = () => {
    setNewTodo({ title: "", description: "" });
    setStatus("typing");
    setError(null);
    setIsOpen(true);
  };
  console.log("Modal todo creation opened");
  return (
    <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild={true}>
            <TooltipTrigger asChild={true}>
              <AddCircle
                size="1.8rem"
                className="cursor-pointer"
                onClick={() => openPopover()}
              />
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-emerald-500">
            <p className="font-bold text-white">Add todo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align={"center"}
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
            value={newTodo.title}
            placeholder="Name this list"
            className="mb-2 ml-4 mr-4 mt-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500"
            onChange={(event) =>
              setNewTodo((old) => ({ ...old, title: event.target.value }))
            }
            disabled={status === "submitting" ? true : false}
            required
          />
          <textarea
            id="listDescription"
            name="description"
            value={newTodo.description}
            placeholder="Description"
            className="mb-1 ml-4 mr-4 mt-1 h-28 rounded-xl bg-gray-300 p-2 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500"
            onChange={(event) =>
              setNewTodo((old) => ({ ...old, description: event.target.value }))
            }
            disabled={status === "submitting" ? true : false}
          />
          <div className="mb-3 ml-4 mr-4 mt-2 flex items-center justify-start">
            <Select
              value={newTodo.priority}
              onValueChange={(value) =>
                setNewTodo((old) => ({ ...old, priority: value }))
              }
              disabled={status == "submitting" ? true : false}
            >
              <SelectTrigger className="mr-3 h-2 w-5/12 p-3 ">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PriorityEnum).map((item, idx) => {
                  return (
                    <SelectItem key={idx} value={item[1]}>
                      {item[0]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              value={newTodo.list}
              onValueChange={(value) => {
                setNewTodo((old) => ({ ...old, list: value }));
              }}
              disabled={status === "submitting" ? true : false}
            >
              <SelectTrigger className="h-2 w-5/12 p-3">
                <SelectValue placeholder="List" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id.toString()}>
                    {list.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4 ml-4 mr-4 flex items-center justify-between">
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 disabled:bg-cyan-200"
              disabled={
                status === "submitting" || newTodo.title.length === 0
                  ? true
                  : false
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
            <div className="text-sm font-bold text-red-500">
              There was an error creating task: {error}
            </div>
          )}
        </form>
        <PopoverArrow className="fill-emerald-500" />
      </PopoverContent>
    </Popover>
  );
}