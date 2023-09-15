import React, { useState } from "react";

import { TaskFormProps } from "../../lib/customTypes";

export default function TaskForm({
  addTodo,
  newTodo,
  setNewTodo,
  isTodoModalOpen,
}: TaskFormProps) {
  const [status, setStatus] = useState("typing");
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo.title == "") return;
    setStatus("submitting");

    try {
      const result = await addTodo(newTodo, "taskList");
      setNewTodo({ title: "", description: "" });
      setStatus("typing");
      setError(null);
    } catch (error) {
      setError(error);
      setStatus("typing");
    }
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
        disabled={status === "submitting" ? true : false}
        required
      />
      <button
        type="submit"
        className="flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-black hover:bg-cyan-600 disabled:bg-cyan-100"
        disabled={
          newTodo.title.length === 0 || status === "submitting" ? true : false
        }
      >
        Add
      </button>
      {error != null && (
        <div className="absolute left-40 top-2 text-sm font-bold text-red-400">
          There was an error creating task: {error}
        </div>
      )}
    </form>
  );
}
