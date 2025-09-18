import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function Addtodos() {
  const [todo, setTodo] = useState("");
  const [todolist, setTodoList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingtext, setEditingText] = useState("");

  //create todo
  const handleChange = (e) => {
    setTodo(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "",
        { text: todo },
        { withCredentials: true }
      );
      setTodoList((prev) => [...prev, data.todo]);
      setTodo("");
      console.log("todo add successfully");
      alert("todo added Succcessfully");
    } catch (error) {
      console.log("todo Add failed!!");
      alert("failed to add the todo");
    }
  };

  //read todo

  useEffect(() => {
    const fetchdata = async () => {
      const res = await axios.get("", { withCredentials: true });
      setTodoList(res.data.todos);
    };
    fetchdata();
  }, []);

  //update todo
  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.text);
  };

  const handleupdate=async(id)=>{
    try {
        await axios.put("/${id}",
            {text:editingtext},
            {withCredentials:true}
        );
        setTodoList((prev)=>prev.map((todo)=>todo._id === id ? {...todo,text:editingtext}:todo));
        setEditingId(null);
        setEditingText("");
        console.log("todo update successfully!")
        
    } catch (error) {
        console.log("todo update failed!!")
    }
  }

  //delete todo

  const handleDelete=async(id)=>{
    try {
        await axios.delete("/${id}",
            {withCredentials:true}
        );
        setTodoList(prev=>prev.filter(todo=>todo._id !==id));
        console.log("todo delete successfully")
        
    } catch (error) {
        console.log("todo delete failed");
        
    }
  }
  return (
    <div>
      <div className="flex text-center justify-center border">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center"
        >
          <input
            type="text"
            placeholder="write your todo"
            name="todo"
            value={todo}
            onChange={handleChange}
          />
          <button className="p-2 py-1 bg-green-400 hover:bg-green-500 text-white">
            Submit
          </button>
        </form>
      </div>
      <div className="flex flex-col justify-center items-center border bg-yellow-300 text-blue-800">
        <h1>All todos</h1>
        <ul className="flex items-center">
          {todolist.length > 0 ? (
            todolist.map((todo) => (
              <li key={todo._id}>
                {editingId === todo._id ? (
                  <>
                    <input
                      type="text"
                      value={editingtext}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <button onClick={() => handleupdate(todo._id)}>save</button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {todo.text}
                    <button onClick={() => handleDelete(todo._id)}>
                      Delete
                    </button>
                    <button onClick={() => handleEdit(todo)}>Edit</button>
                  </>
                )}
              </li>
            ))
          ) : (
            <h1>No todo exists</h1>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Addtodos;
