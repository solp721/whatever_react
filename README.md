# Whatever - JS로 React 만들기

---

<details>
<summary><h2>Week 1</h2></summary>

---

## Week 1 목표

React를 직접 구현해보며 JSX가 JavaScript로 변환되는 과정과 Virtual DOM의 동작 원리를 이해하는 것이다.

---

<details>
<summary><strong>Day 1-2: 개발 환경 구축과 JSX 트랜스파일링 이해</strong></summary>

### 📌 핵심 목표
Vanilla JavaScript로 환경을 구축하고, Babel을 이용해 JSX가 JavaScript로 트랜스파일링되는 과정을 이해한다.

### 📚 핵심 단어

1. **JSX**
   - JavaScript XML의 약자로, JavaScript 코드 안에서 HTML 문법을 사용해 View를 구성할 수 있는 JavaScript 확장 문법.
   - 실행 시 JavaScript로 변환되어 실행되며, 가독성과 유지보수를 높여준다.

2. **트랜스파일링**
   - 한 언어로 작성된 코드를 다른 언어로 변환하는 과정.

3. **Babel**
   - 최신 JavaScript 코드를 구형 브라우저나 환경에서 실행 가능하도록 ES5로 변환해주는 트랜스컴파일러.

### 🛠️ 필수 작업
- Vite로 프로젝트를 초기화한다.
- Babel 플러그인을 설치하고 설정한다.
- JSX 파일을 작성하고 트랜스파일링 결과를 확인한다.

### 💡 배운 점
- JSX가 JavaScript로 변환될 때 `createElement` 함수 호출로 바뀌는 과정을 알게 되었다.
- Babel 설정에서 `@babel/plugin-transform-react-jsx`와 `runtime: automatic` 옵션을 활용해 JSX 문법을 지원할 수 있었다.

### 💬 회고
환경 설정과 Babel 트랜스파일링 과정을 배우면서 JSX의 동작 방식을 이해했다.  
하지만 처음 설정이 잘못되어 디버깅에 많은 시간을 썼고, 한 번에 몰아서 작업하면서 학습의 깊이가 부족했다.

</details>

---

<details>
<summary><strong>Day 3-4: createElement 함수 구현과 Virtual DOM 생성</strong></summary>

### 📌 핵심 목표
JSX 트랜스파일링 과정을 이해한 후, `createElement` 함수를 직접 구현하며 Virtual DOM 객체를 생성한다.

### 📚 핵심 단어

1. **createElement**
   - JSX를 트랜스파일링했을 때 호출되는 함수로, Virtual DOM 객체를 생성한다.
   - React의 핵심 메커니즘 중 하나.

2. **Virtual DOM**
   - 메모리 상에 존재하는 가상 DOM 객체로, 실제 DOM과 1:1로 매핑된다.
   - 변경사항을 가상 DOM에서 먼저 계산하고, 효율적으로 실제 DOM에 반영한다.

### 🛠️ 필수 작업
- `createElement` 함수를 구현한다.
  - 문자열과 숫자는 `TEXT_ELEMENT`로 변환한다.
  - 객체는 그대로 사용한다.
- Virtual DOM 객체를 콘솔로 출력해 확인한다.

### 📂 코드예제
```javascript
function createElement(type, props, ...children) {
  const element = {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" || typeof child === "number"
          ? createTextElement(child)
          : child
      ),
    },
  };

  return element;
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
```
### 💡 배운 점
- JSX에서 문자열과 숫자가 `TEXT_ELEMENT`로 처리되는 방식을 이해했다.
- Virtual DOM 구조를 직접 구현하면서 React의 기본 원리를 체감할 수 있었다.

### 💬 회고
Virtual DOM의 구조를 이해하는 데 큰 도움이 되었다.  
하지만 출력 결과에서 **텍스트가 한 글자씩 `TEXT_ELEMENT`로 처리되는 문제**가 발생했다.  
예를 들어, `"Virtual DOM 이해하기"`라는 텍스트가 여러 개의 `TEXT_ELEMENT`로 분리되는 현상이 나타났고, 이는 설계 단계에서 충분히 고민하지 못한 결과다.  
이 문제를 해결하지 못한 채 시간이 지나갔고, 다음 단계로 넘어가며 부담이 더 커졌다.

</details>

---

<details>
<summary><strong>Day 5: 간단한 컴포넌트 작성 및 렌더링</strong></summary>

### 📌 핵심 목표
Virtual DOM을 실제 DOM으로 변환하여 화면에 렌더링하는 `render` 함수를 작성하고, 간단한 컴포넌트를 작성해 렌더링한다.

### 📚 핵심 단어

1. **컴포넌트**
   - 재사용 가능한 UI 단위로, 함수 형태로 구현된다.
   - Virtual DOM을 반환하며, 복잡한 UI를 모듈화해 관리할 수 있다.

2. **렌더링**
   - Virtual DOM 객체를 기반으로 실제 DOM을 생성하고, 화면에 표시한다.

### 🛠️ 필수 작업
- `render` 함수를 구현한다.
  - 텍스트 노드는 `TextNode`로 처리한다.
  - DOM 노드와 프로퍼티를 생성 및 설정한다.
  - 재귀적으로 자식 노드를 렌더링한다.

### 📂 코드 예제

```javascript
function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type);

  Object.keys(element.props || {})
    .filter((key) => key !== "children")
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  (element.props.children || []).forEach((child) => render(child, dom));
  container.appendChild(dom);
}
```

### 💡 배운 점
- Virtual DOM에서 실제 DOM으로 변환되는 과정을 알게 되었다.
- 재귀적으로 DOM 트리를 생성하는 방식의 중요성을 깨달았다.

### 💬 회고
`render` 함수를 작성하며 Virtual DOM과 실제 DOM 간의 연결 과정을 이해했다.  
하지만 앞서 언급한 텍스트 한 글자씩 처리되는 문제는 여전히 해결되지 않았고, 그 결과 UI가 의도한 대로 렌더링되지 않았다.  
이 문제를 근본적으로 해결하지 못한 채 코드 작업을 마쳤고, 이후 작업에 큰 장애가 될 가능성이 높다.

</details>

---

## 한 주를 마치며

이번 주는 면접과 학술제 준비로 바쁜 나날을 보냈다.
큰맘 먹고 시작한 수업이었지만, 일정에 쫓겨 제대로 따라가지 못했다는 아쉬움이 남는다.
특히 멘토님이 권장하지 않은 **하루 만에 몰아서 하기**를 선택하면서 학습 과정이 더 힘들어졌다.
급하게 코드를 작성하다 보니 설계나 개념에 대해 충분히 고민할 시간을 가지지 못한 점이 안타깝다.

React의 핵심 원리를 배우는 데 중요한 시간이었음에도, 하루에 몰아서 작업했기에 개념 이해가 매우 부족했다
이로 인해 학습의 깊이를 충분히 다지지 못했으며, 문제를 근본적으로 해결하지 못한 채 다음 단계로 넘어가야 했던 점이 가장 아쉽다.

### 반성 및 개선 계획
- 매일 일정에 맞춰 조금씩 작업하며, 몰아서 작업하는 습관을 버리겠다.
- 코드 작성 전에 설계를 충분히 고민하고, 문제 발생 시 원인을 논리적으로 분석하는 습관을 들이겠다.
- 문제가 발생했을 때, 근본적인 원인을 이해하고 수정할 수 있도록 더 깊이 학습하겠다.

</details>

---

<details>
<summary><h2>Week 2</h2></summary>

---

## Week 2 목표

Virtual DOM을 실제 DOM으로 렌더링하는 과정을 이해하고, 상태 관리(useState)를 직접 구현하여 React의 상태 관리 메커니즘을 깊이 있게 이해한다.

---

<details>
<summary><strong>Day 1-2: Virtual DOM을 실제 DOM으로 렌더링하기</strong></summary>

### 📌 핵심 목표

Virtual DOM을 순회하여 실제 DOM을 생성하는 `render` 함수를 구현하고, 재귀적으로 DOM 트리를 생성하는 방법을 이해한다.

### 📚 핵심 단어

1. **렌더링 (Rendering)**
   - **일반적인 의미**: 데이터를 시각적 요소로 변환하여 사용자 화면에 표시하는 과정.
   - **React에서의 사용**: Virtual DOM을 기반으로 실제 DOM을 생성하거나 업데이트하여 효율적으로 UI를 보여주는 메커니즘.

2. **재귀 (Recursion)**
   - 함수가 자기 자신을 호출하는 프로그래밍 기법.
   - 트리 구조의 데이터를 순회하거나 처리할 때 유용하게 사용된다.

### 🛠️ 필수 작업

- `render` 함수를 구현하여 Virtual DOM을 실제 DOM으로 변환한다.
  - 노드의 `type`이 문자열인 경우 DOM 요소를 생성한다.
  - 노드의 `type`이 "TEXT_ELEMENT"인 경우 텍스트 노드를 생성한다.
  - `props`를 읽어 DOM 속성을 설정한다.
  - 자식 노드가 있는 경우 재귀적으로 `render` 함수를 호출하여 자식 노드를 처리한다.

#### 📂 코드 예제

````javascript
// render.js
function render(element, container) {
  // 함수형 컴포넌트 처리
  if (typeof element.type === "function") {
    const childElement = element.type(element.props);
    render(childElement, container);
    return;
  }

  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.props.nodeValue) // 텍스트 노드 처리
      : document.createElement(element.type); // DOM 노드 생성

  // 프로퍼티 처리
  const isProperty = (key) => key !== "children";
  Object.keys(element.props || {})
    .filter(isProperty)
    .forEach((name) => {
      try {
        // 이벤트 핸들러 또는 데이터 속성 처리
        if (name.startsWith("on")) {
          const eventType = name.toLowerCase().substring(2);
          dom.addEventListener(eventType, element.props[name]);
        } else if (name in dom) {
          dom[name] = element.props[name];
        } else {
          dom.setAttribute(name, element.props[name]);
        }
      } catch (error) {
        console.warn(`${name}:`, error);
      }
    });

  // 자식 요소 재귀 렌더링
  const children = element.props.children || [];
  (Array.isArray(children) ? children : [children]).forEach((child) => {
    render(child, dom);
  });

  container.appendChild(dom);
}

export { render };

````

### 💡 배운 점

1. **렌더링과 Virtual DOM**
   - 렌더링은 데이터를 UI로 변환하여 사용자 화면에 출력하는 과정이며, React에서는 Virtual DOM을 사용해 효율적인 UI 업데이트를 가능하게 한다.
   - `render` 함수는 Virtual DOM 객체를 기반으로 실제 DOM 트리를 생성하고, 이를 루트 컨테이너에 추가하는 역할을 한다.

2. **재귀를 활용한 트리 구조 순회**
   - 트리 구조의 데이터를 재귀적으로 순회하며 DOM 노드를 생성하고 부모-자식 관계를 설정하는 과정을 체득했다.
   - 복잡한 중첩 구조의 Virtual DOM 객체도 재귀를 통해 효과적으로 처리할 수 있다는 점을 이해했다.

3. **속성 및 텍스트 처리**
   - Virtual DOM 객체의 `props`를 읽어 DOM 속성을 설정하는 방법과 텍스트 노드를 처리하는 방법을 배웠다.

### 💬 회고

`render` 함수를 구현하면서 Virtual DOM 객체가 실제 DOM으로 변환되어 브라우저 화면에 표시되는 과정을 이해할 수 있었다.  
특히 재귀를 통해 트리 구조를 순회하며 요소를 생성하고 부모 노드에 추가하는 방식이 흥미로웠다.  

</details>

---
<details>
<summary><strong>Day 3-4: 상태 관리와 useState 구현</strong></summary>

### 📌 핵심 목표

1. 상태(State)의 개념을 이해하고, 상태 변경에 따라 UI를 업데이트하는 방법을 학습한다.
2. `useState` 함수를 직접 구현하여 상태를 저장하고 업데이트할 수 있다.
3. 상태 변경 시 컴포넌트를 재렌더링하여 화면을 동적으로 업데이트한다.

---

### 📚 핵심 단어

1. **상태(State)**  
   - **일반적인 의미**: 애플리케이션의 현재 데이터 또는 상황을 나타내는 값.  
   - **React에서의 사용**: 컴포넌트 내부에서 변화하는 데이터를 관리하여 UI에 반영하는 역할을 한다.

2. **훅(Hook)**  
   - 함수형 컴포넌트에서 상태와 생명주기 기능을 사용할 수 있게 해주는 기능.  
   - 대표적인 예로 `useState`, `useEffect` 등이 있다.

3. **재렌더링(Re-rendering)**  
   - 상태나 props의 변경으로 인해 컴포넌트가 다시 렌더링되어 UI가 업데이트되는 과정.

---

### 🛠️ 필수 작업

1. `useState` 함수를 구현하여 상태를 관리한다.
2. 상태 변경 시 컴포넌트를 재렌더링하는 메커니즘을 만든다.
3. 카운터 컴포넌트를 작성하여 상태 변경에 따른 UI 변화를 확인한다.

---

#### 📂 코드 예제

```javascript
// core/useState.js
let state = [];
let stateIndex = 0;
let rerender = null;

export function useState(initialValue) {
  const currentIndex = stateIndex++;
  state[currentIndex] = state[currentIndex] !== undefined ? state[currentIndex] : initialValue;

  function setState(newValue) {
    state[currentIndex] = newValue;
    rerender && rerender();
  }

  return [state[currentIndex], setState];
}

export function setRerenderFunc(rerenderFunc) {
  rerender = rerenderFunc;
}

export function resetStateIndex() {
  stateIndex = 0;
}
```

---

### 💡 배운 점

1. **상태 관리의 중요성**  
   - 상태는 애플리케이션이 동적으로 동작하는 데 핵심적인 역할을 한다.
   - 사용자 입력이나 이벤트에 따라 상태를 변경하고, 이를 UI에 반영하여 사용자와의 상호작용을 가능하게 한다.

2. **useState의 동작 원리**  
   - `useState`를 통해 상태 값을 저장하고, 해당 상태를 변경할 수 있는 setState 함수를 얻을 수 있다.
   - 상태 변경 시 `setState`를 호출하면 내부적으로 상태가 업데이트되고, 컴포넌트가 재렌더링되어 변경 사항이 UI에 반영된다.

3. **재렌더링 메커니즘 구현 방**  
   - 상태 변경 시 전체 애플리케이션을 재렌더링하여 최신 상태가 화면에 표시되도록 구현했다.
   - 이를 위해 렌더링 함수를 재호출하고, 상태 인덱스를 초기화하여 상태 관리의 일관성을 유지했다.

4. **상태 인덱스 관리의 필요성**
   - 여러 개의 상태를 관리할 때 각 상태가 올바른 값을 참조하도록 상태 인덱스를 사용했다.
   - 렌더링마다 상태 인덱스를 초기화하고, useState 호출 순서를 유지하여 상태 불일치 문제를 방지했다.

5. **함수형 컴포넌트에서의 상태 관리**
   - 클래스형 컴포넌트 없이도 함수형 컴포넌트에서 훅을 사용하여 상태를 관리할 수 있음을 학습했다.
   - 이는 코드의 간결성과 유지 보수성을 높여준다.

---

### 💬 회고

`useState`를 직접 구현하면서 상태 관리와 재렌더링의 원리를 깊이 있게 이해할 수 있었다. 특히 상태 인덱스를 활용하여 여러 상태를 관리하는 방법과, 상태 변경 시 컴포넌트를 재렌더링하여 UI를 업데이트하는 과정이 인상적이었다. 
카운터 예제를 통해 이러한 개념을 실습하며 React의 핵심 기능을 체득할 수 있었다.


</details>

---

<details>
<summary><strong>Day 5: 간단한 애플리케이션 작성 및 실습</strong></summary>

### 📌 핵심 목표

1. 상태(State) 관리와 이벤트 처리의 개념을 실습을 통해 이해한다.
2. 상태를 사용하는 컴포넌트를 작성하고, UI에 반영하는 방법을 학습한다.
3. Virtual DOM 생성부터 상태 변경에 따른 재렌더링까지의 전체 흐름을 복습한다.

---

### 📚 핵심 단어

1. **상태(State)**
   - **일반적인 의미**: 애플리케이션의 현재 데이터를 나타내는 값.
   - **React에서의 사용**: 컴포넌트의 상태를 관리하고 UI를 동적으로 업데이트하는 데 사용된다.

2. **이벤트 처리**
   - 사용자 입력(클릭, 입력 등)에 반응하여 애플리케이션의 동작을 제어하는 방식.
   - 이벤트 핸들러를 통해 상태를 변경하고 UI를 업데이트한다.

3. **렌더링 흐름**
   - Virtual DOM 생성 → 상태 변경 → Virtual DOM 갱신 → 실제 DOM 반영 → UI 업데이트

---

### 🛠️ 필수 작업

1. `useState`를 활용하여 상태를 관리한다.
2. 사용자 이벤트를 처리하여 상태를 변경하고, 이를 UI에 반영한다.
3. TODO 리스트 애플리케이션을 작성하여 상태 관리 및 이벤트 처리 과정을 이해한다.

---

### 📂 코드 예제

```javascript
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
```

---

### 💡 배운 점

1. **상태 관리와 이벤트 처리**
   - 상태를 통해 동적인 데이터를 관리하며, 사용자 입력 이벤트를 처리하는 방법을 학습했다.

2. **렌더링 흐름 복습**
   - Virtual DOM 생성부터 상태 변경에 따른 재렌더링까지의 과정을 실습하며 이해를 더 깊게 다질 수 있었다.

---

### 💬 회고

TODO 리스트 애플리케이션을 작성하며 상태 관리와 이벤트 처리의 기본 원리를 체득할 수 있었다. 상태 변경에 따라 UI가 동적으로 갱신되는 과정을 실습하면서 React의 상태 관리 메커니즘을 조금 더 깊이 이해하게 되었다.

다만, 입력 필드가 문자를 입력할 때마다 전체 DOM이 재생성되어 입력 중 커서 위치가 초기화되는 문제가 발생했다. 이 문제를 해결하지 못한 점이 아쉬우며, 상태 관리와 렌더링 최적화에 대해 더 고민해야 할 필요성을 느꼈다.  
이 문제는 다음 주 학습 주제인 Week 3에서 해결 방안을 찾아보며 더 깊이 있게 다뤄볼 계획이다.

---

</details>

---

## 한 주를 마치며

이번 주는 TODO 리스트 애플리케이션을 작성하며 상태 관리와 이벤트 처리의 기본 원리를 학습하는 데 집중했다.  
그러나 입력 필드 초기화 문제와 같은 상태 관리 및 렌더링 최적화의 어려움을 겪으며, React와 같은 라이브러리의 중요성을 다시금 체감했다.

상태 관리와 이벤트 처리의 원리를 이해하는 것은 의미 있는 시간이었지만, 여전히 기초적인 개념과 문제 해결 능력이 부족하다는 점을 느꼈다.  
특히 시간 분배와 학습 계획의 부족으로 인해 작업의 깊이와 효율성이 떨어진 점이 아쉬움으로 남는다.

### 반성 및 개선 계획

1. **문제 해결을 위한 개선**
   - 입력 필드 문제와 같은 렌더링 최적화 문제를 해결하기 위해 React의 내부 동작을 더 깊이 학습할 계획이다.
   - 상태 관리와 재렌더링 메커니즘에 대한 추가 실습을 통해 이해도를 높이겠다.

2. **시간 관리**
   - 작업 시간을 더 효과적으로 분배하고, 몰아서 학습하는 습관을 고치겠다.
   - 매일 조금씩 학습하여 꾸준히 이해를 다지고, 학습의 깊이를 높이는 방식으로 진행하겠다.

3. **학습 계획의 구체화**
   - 매주 학습 목표와 실습 과제를 더 세분화하여, 학습 중 발생할 수 있는 문제를 예상하고 대비하겠다.

</details>

---


<details>
<summary><h2>Week 3</h2></summary>

---

## Week 3 목표

Virtual DOM 비교(diffing) 알고리즘을 구현하고, 이벤트 처리와 추가적인 훅(hook)인 useEffect를 만들어 React의 렌더링 원리를 이해한다.

---
<details>
<summary><strong>Day 1-2: Virtual DOM 비교(diffing) 알고리즘 구현</strong></summary>

### 📌 핵심 목표

이전 Virtual DOM과 새로운 Virtual DOM을 비교하여 변경된 부분만 실제 DOM에 반영하는 `diff` 알고리즘을 구현하고, 최소한의 DOM 업데이트를 통해 성능 최적화를 이해한다.

### 📚 핵심 단어

1. **Virtual DOM**
   - React에서 UI 업데이트를 효율적으로 수행하기 위해 사용하는 가벼운 JavaScript 객체 기반의 DOM 표현.
   - 실제 DOM과의 차이를 계산하여 필요한 부분만 업데이트한다.

2. **diffing 알고리즘**
   - 이전 Virtual DOM과 새로운 Virtual DOM을 비교하여 변경된 부분을 찾아내는 알고리즘.
   - DOM 조작의 최소화를 목표로 한다.

3. **최소 DOM 업데이트**
   - 변경된 노드만 실제 DOM에 반영하여 성능을 최적화하는 방식.

### 🛠️ 필수 작업

- `diff` 알고리즘을 구현하여 이전 Virtual DOM과 새로운 Virtual DOM을 비교하고, 필요한 부분만 업데이트한다.
  - 노드가 새로 추가된 경우 DOM에 추가한다.
  - 노드가 삭제된 경우 DOM에서 제거한다.
  - 노드의 속성이나 텍스트가 변경된 경우 DOM을 업데이트한다.
  - 자식 노드를 재귀적으로 비교한다.

#### 📂 코드 예제

````javascript
// diff.js
function diff(oldVDOM, newVDOM, container, index = 0) {
  const currentDom = container.childNodes[index];

  if (!oldVDOM) {
    const newDom = createDom(newVDOM);
    container.appendChild(newDom);
  } else if (!newVDOM) {
    if (currentDom) {
      container.removeChild(currentDom);
    }
  } else if (oldVDOM.type !== newVDOM.type) {
    const newDom = createDom(newVDOM);
    container.replaceChild(newDom, currentDom);
  } else if (typeof newVDOM.type === "string") {
    updateDom(currentDom, oldVDOM.props, newVDOM.props);

    const oldChildren = oldVDOM.props.children || [];
    const newChildren = newVDOM.props.children || [];
    const max = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < max; i++) {
      diff(oldChildren[i], newChildren[i], currentDom, i);
    }
  } else if (oldVDOM.type === "TEXT_ELEMENT") {
    if (oldVDOM.props.nodeValue !== newVDOM.props.nodeValue) {
      currentDom.textContent = newVDOM.props.nodeValue;
    }
  }
}

export { diff };
````

### 💡 배운 점

1. **Virtual DOM 비교의 중요성**
   - Virtual DOM은 UI를 효율적으로 업데이트하는 데 중요한 역할을 한다.
   - `diff` 알고리즘을 통해 변경된 부분만 DOM에 반영함으로써 전체 DOM 재렌더링의 비용을 줄일 수 있다.

2. **재귀를 통한 트리 비교**
   - 트리 구조를 재귀적으로 순회하며 노드를 비교하고, 변경 사항에 따라 DOM을 업데이트하는 원리를 이해했다.
   - 트리 구조의 데이터를 처리하는 데 재귀가 효과적인 도구임을 체감했다.

3. **최소 DOM 업데이트**
   - 속성 변경, 노드 추가/삭제, 텍스트 변경 등 실제 DOM 조작을 최소화하여 렌더링 성능을 향상시킬 수 있음을 배웠다.

### 💬 회고

`diff` 알고리즘 구현을 통해 Virtual DOM의 비교 및 최소 DOM 업데이트의 중요성을 깨달았다.  
특히 재귀적으로 트리를 순회하며 변경 사항을 찾아내는 과정이 흥미로웠으며, DOM 업데이트 비용을 최소화하는 원리를 구체적으로 이해할 수 있었다.  

### ✅ 확인한 점

카운터 앱에서 숫자가 변경될 때, `diff` 함수의 비교 로그를 통해 **이전 Virtual DOM과 새로운 Virtual DOM이 정확히 비교**되었음을 확인하였다.  
아래는 로그 예시로, 숫자가 변경되었을 때 `TEXT_ELEMENT` 노드만 업데이트되었음을 보여준다:

```plaintext
노드 비교 : 
이전: { type: "TEXT_ELEMENT", props: { nodeValue: 0, children: [] } }
현재: { type: "TEXT_ELEMENT", props: { nodeValue: 1, children: [] } }
```
이와 동시에, 나머지 UI 요소들은 변경되지 않고 그대로 유지되었음을 확인하였다. 이는 diff 알고리즘이 최소한의 DOM 업데이트를 수행했음을 증명한다.

</details> 

---

<details> 
<summary><strong>Day 3-4: 이벤트 처리 및 Synthetic Event 시스템 구현</strong></summary>

### 📌 핵심 목표
사용자와의 상호작용을 처리하기 위해 이벤트 시스템을 구현하고, Synthetic Event 시스템을 통해 브라우저 간 이벤트 처리 차이를 통일하며, 이벤트 위임을 통해 효율적인 이벤트 처리를 구현한다.

---

### 📚 핵심 단어

1. **Synthetic Event**
   - 브라우저의 이벤트 객체를 래핑하여 React가 통일된 방식으로 이벤트를 처리할 수 있게 해주는 시스템.
   - 이벤트 전파 제어 및 기본 동작 방지 같은 기능을 일관되게 제공한다.

2. **이벤트 위임**
   - 이벤트를 개별 DOM 요소에 붙이는 대신, 상위 컨테이너에 등록하여 모든 하위 요소의 이벤트를 한 번에 처리하는 방식.
   - 성능 최적화에 유리하며, 많은 DOM 노드를 효율적으로 관리할 수 있다.

3. **Virtual DOM과 이벤트**
   - Virtual DOM의 `props`에서 이벤트 핸들러를 가져와 실제 DOM에 등록하여 JSX 기반 이벤트 처리를 구현한다.

---

### 🛠️ 필수 작업

1. **Synthetic Event 시스템 구현**
   - 브라우저의 이벤트 객체를 래핑하여 이벤트 전파 제어 및 기본 동작 방지를 처리.
   - Synthetic Event 객체를 재사용하여 메모리 사용 최적화.

2. **이벤트 위임 구현**
   - 상위 컨테이너에 이벤트를 등록하여 모든 DOM 이벤트를 한 곳에서 처리.
   - 이벤트 위임 활성화를 위한 `addEventDelegation` 함수 구현.

3. **상태 변경에 따른 UI 업데이트 확인**
   - Counter 및 Todo 컴포넌트를 테스트하여 상태 변경 시 Virtual DOM과 실제 DOM의 동기화 확인.

---

### 📂 코드 예제

#### Synthetic Event 시스템
````javascript
function createSyntheticEvent(nativeEvent) {
  const syntheticEvent = {
    nativeEvent,
    isDefaultPrevented: false,
    isPropagationStopped: false,
    preventDefault() {
      this.isDefaultPrevented = true;
      nativeEvent.preventDefault();
    },
    stopPropagation() {
      this.isPropagationStopped = true;
      nativeEvent.stopPropagation();
    },
  };
  return syntheticEvent;
}

export { createSyntheticEvent };
````

---

#### 이벤트 위임 시스템
````javascript
function handleEvent(eventType, nativeEvent) {
  const syntheticEvent = createSyntheticEvent(nativeEvent);
  let target = nativeEvent.target;

  while (target) {
    const handler = target[eventType];
    if (handler) {
      handler(syntheticEvent);
      if (syntheticEvent.isPropagationStopped) break;
    }
    target = target.parentNode;
  }
}

let isDelegationActive = false;

function addEventDelegation(container) {
  if (isDelegationActive) return;
  isDelegationActive = true;

  container.addEventListener("click", (event) => handleEvent("onClick", event));
  container.addEventListener("input", (event) => handleEvent("onInput", event));
}

export { addEventDelegation };
````

---

### 💡 배운 점

1. **Synthetic Event의 중요성**
   - 브라우저 간 이벤트 차이를 추상화하여 코드의 일관성을 유지할 수 있었다.
   - 객체를 재사용하는 방식을 통해 메모리 사용 효율성을 체득했다.

2. **이벤트 위임의 효율성**
   - 이벤트 리스너를 개별 노드가 아닌 상위 컨테이너에 한 번만 등록함으로써 성능을 최적화할 수 있었다.
   - 많은 DOM 노드에서 발생하는 이벤트도 효율적으로 관리 가능했다.

3. **Virtual DOM과의 연동**
   - Virtual DOM의 props에서 이벤트 핸들러를 가져와 DOM에 등록함으로써 JSX 기반 이벤트 처리를 구현할 수 있었다.
   - 상태 변경에 따른 Virtual DOM 갱신과 실제 DOM 업데이트의 차이를 명확히 이해했다.

---

### 💬 회고

Synthetic Event 시스템과 이벤트 위임을 구현하면서 React의 이벤트 처리 방식이 왜 효율적인지 더 깊이 이해할 수 있었다.  
특히, 브라우저 간 이벤트 차이를 숨기고 일관된 이벤트 처리 환경을 제공하는 것이 얼마나 중요한지 체감할 수 있었다.  
Todo와 Counter 컴포넌트를 통해 Synthetic Event와 상태 관리가 자연스럽게 동작하며, UI가 업데이트되는 과정을 확인할 수 있었다.  

앞으로 더 복잡한 상태 관리나 다양한 이벤트 처리를 추가하며, 더욱 확장된 시스템을 구현해보고 싶다.

</details>

---

<details>
<summary><strong>Day 5: 추가적인 훅(`useEffect`) 구현 및 컴포넌트 생명주기 관리</strong></summary>

### 📌 핵심 목표
`useEffect` 훅을 구현하여 컴포넌트의 마운트, 업데이트, 언마운트 생명주기를 관리하고, 클린업 로직을 통해 메모리 누수를 방지하며, 사이드 이펙트를 효율적으로 처리한다.

---

### 📚 핵심 단어

1. **컴포넌트 생명주기**
   - 컴포넌트가 생성(마운트), 상태 또는 속성의 변경으로 인해 업데이트, 그리고 제거(언마운트)되는 일련의 과정.
   - **마운트(Mount)**: 컴포넌트가 DOM에 삽입되고 초기화 작업을 수행하는 단계. 예: API 호출, 이벤트 리스너 등록.
   - **업데이트(Update)**: 컴포넌트의 상태(state)나 속성(props)이 변경되어 DOM이 갱신되는 단계. 
   - **언마운트(Unmount)**: 컴포넌트가 DOM에서 제거되고 리소스를 해제하는 단계. 예: 타이머 제거, 이벤트 리스너 해제.

2. **`useEffect`**
   - 컴포넌트 생명주기에 맞춰 특정 작업(사이드 이펙트)을 실행하기 위한 훅.
   - 마운트 시 초기화 작업, 의존성 배열을 활용한 조건부 실행, 언마운트 시 정리 작업을 관리.

3. **클린업 함수**
   - `useEffect` 내부에서 반환하는 함수로, 컴포넌트가 언마운트될 때 실행되어 불필요한 리소스를 해제.
   - 타이머나 이벤트 리스너와 같은 리소스를 정리해 메모리 누수를 방지.

---

### 🛠️ 필수 작업

1. **`useEffect` 훅 구현**
   - 의존성 배열을 통해 특정 값이 변경될 때만 이펙트를 실행하도록 구현.
   - 클린업 로직을 통해 컴포넌트 언마운트 시 불필요한 리소스를 정리.

2. **생명주기 관리**
   - 컴포넌트의 마운트 시 초기 작업 수행.
   - 언마운트 시 타이머 및 이벤트 리스너 정리.

3. **테스트**
   - 타이머 컴포넌트를 통해 마운트, 업데이트, 언마운트 생명주기 관리를 확인.

---

### 📂 코드 예제

#### **`useEffect` 구현**
````javascript
let effects = [];
let effectIndex = 0;

export function useEffect(callback, dependencies) {
  const currentIndex = effectIndex;
  const oldDependencies = effects[currentIndex];
  const hasChanged = !oldDependencies || dependencies.some((dep, i) => dep !== oldDependencies[i]);

  if (hasChanged) {
    if (effects[currentIndex]?.cleanup) {
      effects[currentIndex].cleanup(); // 이전 클린업 실행
    }
    effects[currentIndex] = {
      dependencies,
      cleanup: callback(),
    };
  }

  effectIndex++;
}

export function resetEffectIndex() {
  effectIndex = 0; // Effect 인덱스 초기화
}
````

---

#### **타이머 컴포넌트**
````javascript
import { useState } from "../core/hooks/useState";
import { useEffect } from "../core/hooks/useEffect";

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return; // 타이머 중지 시 실행 안 함

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval); // 타이머 정리
      console.log("타이머 정리 완료");
    };
  }, [isRunning]); // isRunning 변경 시 실행

  return (
    <div>
      <div>경과 시간: {time}초</div>
      <button onclick={() => setIsRunning((prev) => !prev)}>
        {isRunning ? "타이머 중지" : "타이머 시작"}
      </button>
    </div>
  );
}

export default Timer;
````

---

### 💡 배운 점

1. **생명주기 관리의 중요성**:
   - 컴포넌트의 마운트, 업데이트, 언마운트 단계에 따라 적절한 작업을 처리할 수 있었다.
   - 특히, 마운트 단계에서 초기화 작업(API 호출, 타이머 설정 등)과 언마운트 단계에서 리소스 해제가 필요하다는 점을 명확히 이해했다.

2. **클린업 로직의 활용**:
   - 타이머와 같은 지속적인 작업을 언마운트 시 정리하여 메모리 누수를 방지했다.
   - 클린업 함수의 사용이 리소스 관리에 필수적임을 배웠다.

3. **`useState`와 `useEffect`의 조합**:
   - 상태 변경에 따른 효과적인 사이드 이펙트 처리 방법을 체득.
   - 예를 들어, `isRunning` 상태에 따라 타이머를 동적으로 제어하는 로직을 구현했다.

4. **의존성 배열의 활용**:
   - 의존성 배열을 통해 특정 상태 변경 시에만 이펙트가 실행되도록 최적화했다.
   - 불필요한 작업 실행을 줄여 성능을 높였다.

---

### 💬 회고

`useEffect` 훅을 직접 구현하며, React의 컴포넌트 생명주기 관리 방식의 유연성과 강력함을 이해할 수 있었다.  
특히 타이머와 같은 지속적인 작업에서 클린업이 얼마나 중요한지 체감했으며, 리액트가 이 작업을 자동화해주는 이유를 명확히 알게 되었다.  
다음 단계에서는 API 호출 등 더 복잡한 사이드 이펙트를 처리할 수 있는 예제를 추가해보고 싶다.

</details>



