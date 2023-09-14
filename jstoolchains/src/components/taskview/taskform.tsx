import React from "react";

import { TaskFormProps } from "../../lib/customTypes";

export default function TaskForm({
  addTodo,
  newTodo,
  setNewTodo,
  isTodoModalOpen,
}: TaskFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo.title == "") return;
    addTodo(newTodo, "taskList");
  };

  return (
    <form
      id="myform"
      className="font-serif mb-6 flex space-x-4 text-lg"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="title"
        className="h-10 flex-1 rounded-xl bg-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500"
        id="todoText"
        value={isTodoModalOpen ? "" : newTodo.title}
        onChange={(e) =>
          setNewTodo((old) => ({ ...old, title: e.target.value }))
        }
        placeholder="Enter your todo here"
        required
      />
      <button
        type="submit"
        className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-400 p-3 text-black hover:bg-cyan-500"
      >
        Add
      </button>
    </form>
  );
}
