//https://www.shecodes.io/athena/9359-how-to-read-and-delete-json-data-in-react
//https://www.dhiwise.com/post/mastering-jsoneditor-react-for-efficient-data-manipulation

import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import Model from './model/model.js'
import Chart from './chart/chart.js'
import data from "./data.json";

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(data);
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  const deleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  const addItem = () => {
    const newItem = { id: items.length + 1, name: newItemName };
    setItems([...items, newItem]);
    setNewItemName("");
  };

  const handleNewItemChange = (event) => {
    setNewItemName(event.target.value);
  };

  return (
    <div>
      <h1>{message}</h1>
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <button onClick={() => deleteItem(item.id)}>Delete</button>
        </div>
      ))}
      <div>
        <input type="text" value={newItemName} onChange={handleNewItemChange} />
        <button onClick={addItem}>Add Item</button>
      </div>
      <Model/>
    </div>
  );
}

export default App;
