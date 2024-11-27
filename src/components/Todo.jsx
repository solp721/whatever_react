import { useState } from "../core/useState";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  function addTodo() {
    if (input.trim()) {
      setTodos([...todos, input]);
      setInput("");
    }
  }

  return (
    <div>
      <h2>할 일 목록</h2>
      <input
        type="text"
        value={input}
        oninput={(e) => setInput(e.target.value)}
      />
      <button onclick={addTodo}>추가</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
