import React, { useState } from "react";

export const useEditTodo = () => {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      dispatch({
        type: "EDIT_TODO",
        payload: { id: editId, text: editText },
      });
  
      setEditId(null);
    }
  };

  return {
    editText,
    editId,
    setEditText,
    setEditId,
    startEditing,
    saveEdit,
    };
};
