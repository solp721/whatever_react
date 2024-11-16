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

### 💡 회고
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

### 💡 회고
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

### 💡 회고
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
</details>
