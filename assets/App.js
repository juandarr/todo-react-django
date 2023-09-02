import React, { useState } from '../jstoolchains/node_modules/react';
import { Configuration, BaseAPI } from '../todo-api-client/runtime';

//{% csrf_token %}

function TaskForm({ addTodo }) {
    const [newTodo, setNewTodo] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTodo == "") return
        addTodo(newTodo);
    };

    return (<form id="myform" className="flex mb-6 space-x-4" onSubmit={handleSubmit}>
        <input type="text" name="title" className="input input-bordered input-secondary flex-1 px-4 py-3 bg-gray-200 rounded-xl text-gray-700" id="todoText" onChange={e => setNewTodo(e.target.value)} placeholder="Enter your todo here" required />
        <button type="submit" className="p-3 rounded-xl text-white bg-cyan-500 hover:bg-cyan-600">Add</button>
    </form>);
};

function TaskListHeader() {
    return (<div className="flex py-3 rounded-xl bg-gray-100">
        <div className="w-1/5 text-center">
            <p className="px-6 text-xs font-medium text-gray-500 uppercase">Done</p>
        </div>
        <div className="w-3/5">
            <p className="px-6 text-xs font-medium text-gray-500 uppercase">Task</p>
        </div>
        <div className="hidden md:block w-1/5 px-6 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase">Actions</p>
        </div>
    </div>);
};

function TaskList({ todos, toggleTodo, deleteTodo, editTodo }) {

    const [edit, setEdit] = useState([false, ""]);
    const [textEdit, setTextEdit] = useState("");

    const handleKeyPress = (event, todo) => {
        event.preventDefault();
        editTodo(todo.id, textEdit, setEdit);
    }

    const taskList = todos.map((todo, idx) => {
        const line = todo.complete ? "line-through" : "";
        const class_created = "badge bg-primary text-wrap " + line;
        const class_title = "w-3/5 py-2 text-truncate text-gray-700 font-small " + line;
        const show_edit = edit[0] && edit[1] == todo.id;
        return (<li key={todo.id}>
            <form className="flex" onSubmit={e => handleKeyPress(e, todo)} >
                <div className="w-1/5 py-2 text-center">
                    <input className="checkbox checkbox-primary" type="checkbox" style={{ "cursor": "pointer" }} checked={todo.complete} onChange={e => toggleTodo(todo.id, e.target.checked)} id={"checkbox-" + idx} />
                </div>
                {!show_edit ? <div className={class_title} style={{ "cursor": "pointer" }} onClick={e => { setEdit([true, todo.id]); setTextEdit(todo.title); }}>
                    {todo.title}
                </div> : <input type="text" className="font-small w-3/5 text-truncate bg-white text-gray-700 border-0" name="title"
                    value={textEdit} onChange={e => setTextEdit(e.target.value)} autoFocus></input>}
                <div className="w-1/5 py-2 text-center" >
                    {edit[0] && edit[1] == todo.id && <div className="tooltip tooltip-info" data-tip="Save">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-500 hover:text-sky-600" style={{ "cursor": "pointer", "display": "inline" }} onClick={() => editTodo(todo.id, textEdit, setEdit)}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                    </div>}
                    <div className="tooltip tooltip-info" data-tip="Delete">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" onClick={() => deleteTodo(todo.id)}
                            className="h-6 w-6 text-sky-500 hover:text-sky-600" style={{ "cursor": "pointer", "display": "inline" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </form>
            <div className="flex pb-2 mt-0 pt-0">
                <div className="w-3/5 text-center">
                    <div
                        className={class_created}>
                        {todo.created_at}
                    </div>
                </div>
            </div>
        </li>);
    });

    if (todos.length !== 0) {
        return (<ul className="divide-y divide-gray-150">
            {taskList}
        </ul>);
    } else {
        return (<div className="flex-1 px-6 py-6 text-l text-violet-600">No todos yet!</div>);
    }
};

let all_todos = [
    { "id": 1, "title": "Buy more food", "description": "Go to the grocery shop", "complete": false, "created_at": (new Date(2020, 2, 11, 10, 20, 32)).toDateString() },
    { "id": 2, "title": "Finish the product", "description": "Keep working on it", "complete": false, "created_at": (new Date(2020, 2, 11, 10, 20, 32)).toDateString() },
    { "id": 3, "title": "Add the pomodoro show to the party", "description": "Flying color and happines", "complete": false, "created_at": (new Date(2020, 2, 11, 10, 20, 32)).toDateString() }];
let counter = 3;

export default function App() {

    const apiConfig = new Configuration({});
    const client = new BaseAPI(apiConfig);

    client.todosList().then((result) => {
        console.log('Here are the todos: ', result.results);
    });
    const [todos, setTodos] = useState(all_todos);

    const addTodo = (title) => {
        counter += 1;
        setTodos((prevTodos) => {
            const form = document.getElementById('myform').reset();
            return [...prevTodos, { 'title': title, "id": counter, "complete": false, "description": "", "created_at": (new Date(Date.now())).toDateString() }];
        }
        )
    };

    const toggleTodo = (id, complete) => {
        setTodos((prevTodos) => {
            return prevTodos.map((todo) => {
                if (todo.id == id) {
                    return { ...todo, complete };
                } else {
                    return todo
                }
            });
        });
    };

    const deleteTodo = (id) => {
        setTodos((prevTodos) => {
            return prevTodos.filter(todo => todo.id !== id);
        });
    }

    const editTodo = (id, title, setEdit) => {
        setEdit([false, ""]);
        setTodos((prevTodos) => {
            return prevTodos.map((todo) => {
                if (todo.id == id) {
                    return { ...todo, title };
                } else {
                    return todo
                }
            });
        });
    };
    return (<>
        <TaskForm addTodo={addTodo} />
        <TaskListHeader />
        <TaskList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
    </>);
};