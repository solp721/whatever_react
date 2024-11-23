import { useState } from "../core/useState";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  function addTodo() {
    if (input.trim()) {
      setTodos([...todos, { text: input, completed: false }]);
      setInput("");
    }
  }

  function toggleTodo(index) {
    const newTodos = todos.slice();
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  }

  return (
    <div>
      <h2>TODO 리스트</h2>
      <input
        type="text"
        value={input}
        oninput={(e) => setInput(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button onclick={addTodo}>추가</button>
      <ul>
        {todos.map((todo, index) => (
          <li onclick={() => toggleTodo(index)}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
