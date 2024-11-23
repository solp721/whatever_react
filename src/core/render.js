/**
 * @description Virtual DOM을 실제 DOM으로 변환하여 렌더링
 */
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
