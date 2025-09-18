import axios from 'axios';
import React from 'react'
import { useEffect,useState } from 'react';

function Todos() {
    const [todos, setTodos] =useState("");
    const [todoList, setTodoList] =useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(()=>{
        const fetchData=async()=>{
                try {
                    const response= await axios.get("http://localhost:5000/api/todos/",{
                        withCredentials:true
                    });
                    setTodoList(response.data.todos);
                    console.log("fetched Successfully")
                } catch (error) {
                    console.log("data detch failed fetchdata api error")
                }
        }
        fetchData()

    },[])
    

    const handleChange=(e)=>{
        setTodos(e.target.value);
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const {data}= await axios.post("http://localhost:5000/api/todos/",
                {text:todos},
                {withCredentials:true}
            );
            setTodoList(prev=>[...prev,data.todo]);
            setTodos("");
            alert("todo add successfully")
            
        } catch (error) {
            console.log("todo added failed!!")
        }

    }

    const handleDelete=async(id)=>{
        try {
            await axios.delete(`http://localhost:5000/api/todos/${id}`,
              {  withCredentials:true}
            )
            setTodoList(prev=>prev.filter(todo=>todo._id !== id));
            alert("todo delete Successfully")
            
        } catch (error) {
            console.log("Failed to delete todo", error);
        }

    }

// Handle edit button click
const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
};

// Handle update/save button click
const handleUpdate = async (id) => {
    try {
        await axios.put(
            `http://localhost:5000/api/todos/${id}`,
            { text: editText },
            { withCredentials: true }
        );
        setTodoList((prev) =>
            prev.map((todo) =>
                todo._id === id ? { ...todo, text: editText } : todo
            )
        );
        setEditingId(null);
        setEditText("");
        alert("Todo updated successfully");
    } catch (error) {
        console.log("Failed to update todo", error);
    }
};

return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Todos Page</h1>
            <form className="flex gap-2" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Add a new todo..."
                    name='text'
                    value={todos}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </form>

            <div className="mt-6 mb-2 font-semibold text-gray-700">Show All todos</div>
            {todoList.length > 0 ? (
                <ul className="space-y-2">
                    {todoList.map((todo) => (
                        <li key={todo._id} className="bg-gray-200 rounded px-4 py-2 text-gray-800 flex justify-between items-center">
                            {editingId === todo._id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="flex-1 px-2 py-1 border rounded"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            onClick={() => handleUpdate(todo._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditText("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span>{todo.text}</span>
                                    <div className="flex gap-2">
                                        <button
                                            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                                            onClick={() => handleEdit(todo)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                            onClick={() => handleDelete(todo._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-gray-500 mt-4">No todos found.</div>
            )}
        </div>
    </div>
);
}

export default Todos
