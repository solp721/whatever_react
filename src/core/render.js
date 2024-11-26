function diff(oldVDOM, newVDOM, container, index = 0) {
  // 현재 DOM 노드 가져오기
  const currentDom = container.childNodes[index];

  if (!oldVDOM) {
    // 이전 Virtual DOM이 없으면 새 Virtual DOM을 생성하여 추가
    const newDom = createDom(newVDOM);
    container.appendChild(newDom);
  } else if (!newVDOM) {
    // 새로운 Virtual DOM이 없으면 기존 DOM을 제거
    if (currentDom) {
      container.removeChild(currentDom);
    }
  } else if (oldVDOM.type !== newVDOM.type) {
    // Virtual DOM의 타입이 다르면 기존 DOM을 교체
    const newDom = createDom(newVDOM);
    container.replaceChild(newDom, currentDom);
  } else if (typeof newVDOM.type === "string") {
    // Virtual DOM 타입이 동일하면 속성을 업데이트하고, 자식 노드 비교
    updateDom(currentDom, oldVDOM.props, newVDOM.props);

    const oldChildren = oldVDOM.props.children || [];
    const newChildren = newVDOM.props.children || [];
    const max = Math.max(oldChildren.length, newChildren.length);

    // 자식 노드 순회 및 비교
    for (let i = 0; i < max; i++) {
      diff(oldChildren[i], newChildren[i], currentDom, i);
    }
  } else if (oldVDOM.type === "TEXT_ELEMENT") {
    // 텍스트 노드인 경우 텍스트 값 비교 후 업데이트
    if (oldVDOM.props.nodeValue !== newVDOM.props.nodeValue) {
      currentDom.textContent = newVDOM.props.nodeValue;
    }
  }
}

function createDom(element) {
  // 텍스트 노드와 일반 노드를 구분하여 DOM 생성
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type);

  // 속성 처리 (이벤트 핸들러 및 DOM 속성 설정)
  Object.keys(element.props || {}).forEach((name) => {
    if (name !== "children") {
      if (name.startsWith("on")) {
        // 이벤트 핸들러 추가
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, element.props[name]);
      } else if (name in dom) {
        // DOM의 기본 속성 처리
        dom[name] = element.props[name];
      } else {
        // 기타 속성 처리 (data-* 속성 등)
        dom.setAttribute(name, element.props[name]);
      }
    }
  });

  // 자식 요소 재귀적으로 생성 후 DOM에 추가
  (element.props.children || []).forEach((child) => {
    const childDom = createDom(child);
    dom.appendChild(childDom);
  });

  return dom;
}

function updateDom(dom, oldProps, newProps) {
  // 필터링된 속성 키 가져오기
  const isProperty = (key) => key !== "children";
  const oldKeys = Object.keys(oldProps || {}).filter(isProperty);
  const newKeys = Object.keys(newProps || {}).filter(isProperty);

  // 이전 속성 중 제거된 속성 삭제
  oldKeys.forEach((name) => {
    if (!(name in newProps)) {
      if (name.startsWith("on")) {
        // 이벤트 핸들러 제거
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, oldProps[name]);
      } else if (name in dom) {
        // 기본 DOM 속성 초기화
        dom[name] = "";
      } else {
        // 기타 속성 제거
        dom.removeAttribute(name);
      }
    }
  });

  // 새로운 속성 중 변경된 속성 추가/갱신
  newKeys.forEach((name) => {
    if (oldProps[name] !== newProps[name]) {
      if (name.startsWith("on")) {
        // 이벤트 핸들러 갱신
        const eventType = name.toLowerCase().substring(2);
        if (oldProps[name]) {
          dom.removeEventListener(eventType, oldProps[name]);
        }
        dom.addEventListener(eventType, newProps[name]);
      } else if (name in dom) {
        // DOM 기본 속성 갱신
        dom[name] = newProps[name];
      } else {
        // 기타 속성 갱신
        dom.setAttribute(name, newProps[name]);
      }
    }
  });
}

function render(newVDOM, container) {
  // 이전 Virtual DOM 가져오기
  const oldVDOM = container._oldVDOM;

  // Virtual DOM 비교 및 업데이트
  diff(oldVDOM, newVDOM, container);

  // 현재 Virtual DOM을 저장하여 이후 비교에 사용
  container._oldVDOM = newVDOM;
}

export { render };
