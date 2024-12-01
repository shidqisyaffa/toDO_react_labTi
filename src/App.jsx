import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { TodoReducer } from "./reducer/todoCase";
import { CheckCircle, Edit, Trash2, XCircle } from "lucide-react";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, dispatch] = useReducer(TodoReducer, []);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      dispatch({ type: "ADD_TODO", payload: newTodo });
      setNewTodo("");
    }
  }, [newTodo]);

  const todoStats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    pending: todos.filter((todo) => !todo.completed).length,
  }), [todos]);

  const useEditTodo = () => {
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const startEditing = (todo) => {
      setEditingId(todo.id);
      setEditText(todo.text);
    };

    const saveEdit = () => {
      if (editText.trim()) {
        dispatch({
          type: "EDIT_TODO",
          payload: { id: editingId, text: editText },
        });
        setEditingId(null);
        setEditText("");
      }
    };

    return { editText, editingId, setEditText, startEditing, saveEdit };
  };

  const { editText, editingId, setEditText, startEditing, saveEdit } = useEditTodo();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          <span className="text-indigo-500">Todo</span> List
        </h1>

        {/* Input Todo */}
        <div className="flex mb-6">
          <input
            ref={inputRef}
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            className="flex-grow p-4 text-gray-700 border border-gray-300 rounded-l-lg focus:ring focus:ring-indigo-300 focus:outline-none"
            placeholder="Tambahkan tugas baru..."
          />
          <button
            onClick={addTodo}
            className="p-4 bg-indigo-500 text-white font-semibold rounded-r-lg hover:bg-indigo-600 transition"
          >
            Tambah
          </button>
        </div>

        {/* Statistik Todo */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-indigo-100 rounded-lg p-3 shadow">
            <p className="text-indigo-700 font-bold text-lg">{todoStats.total}</p>
            <p className="text-gray-500 text-sm">Total</p>
          </div>
          <div className="bg-green-100 rounded-lg p-3 shadow">
            <p className="text-green-700 font-bold text-lg">{todoStats.completed}</p>
            <p className="text-gray-500 text-sm">Selesai</p>
          </div>
          <div className="bg-red-100 rounded-lg p-3 shadow">
            <p className="text-red-700 font-bold text-lg">{todoStats.pending}</p>
            <p className="text-gray-500 text-sm">Pending</p>
          </div>
        </div>

        {/* Daftar Todo */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              {editingId === todo.id ? (
                <div className="flex w-full items-center">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow p-2 border rounded mr-3"
                  />
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-600"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-500 hover:text-red-600 ml-3"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
                    className={`flex-grow cursor-pointer ${
                      todo.completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-blue-500 hover:text-blue-600 mr-2"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => dispatch({ type: "REMOVE_TODO", payload: todo.id })}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
