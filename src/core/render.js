function diff(oldVDOM, newVDOM, container, index = 0) {
  const currentDom = container.childNodes[index];

  console.log("노드 비교 :", { 이전: oldVDOM, 현재: newVDOM });

  // 이전 Virtual DOM이 없을 경우 (새로운 노드 추가)
  if (!oldVDOM) {
    const newDom = createDom(newVDOM); // 새로운 DOM 생성
    container.appendChild(newDom); // 부모 컨테이너에 추가
  }
  // 새로운 Virtual DOM이 없을 경우 (기존 노드 삭제)
  else if (!newVDOM) {
    if (currentDom) {
      container.removeChild(currentDom); // 기존 DOM 노드 삭제
    }
  }
  // Virtual DOM 타입이 다른 경우 (노드 교체)
  else if (oldVDOM.type !== newVDOM.type) {
    const newDom = createDom(newVDOM); // 새로운 DOM 생성
    container.replaceChild(newDom, currentDom); // 기존 DOM을 새 DOM으로 교체
  }
  // 같은 타입의 노드인 경우 (속성 업데이트 및 자식 노드 비교)
  else if (typeof newVDOM.type === "string") {
    updateDom(currentDom, oldVDOM.props, newVDOM.props); // DOM 속성 업데이트

    const oldChildren = oldVDOM.props.children || []; // 이전 자식 노드
    const newChildren = newVDOM.props.children || []; // 새로운 자식 노드
    const max = Math.max(oldChildren.length, newChildren.length); // 비교할 자식 노드의 최대 길이

    // 모든 자식 노드를 재귀적으로 비교
    for (let i = 0; i < max; i++) {
      diff(oldChildren[i], newChildren[i], currentDom, i);
    }
  }
  // 텍스트 노드인 경우 (텍스트 변경 사항 확인 및 업데이트)
  else if (oldVDOM.type === "TEXT_ELEMENT") {
    if (oldVDOM.props.nodeValue !== newVDOM.props.nodeValue) {
      currentDom.textContent = newVDOM.props.nodeValue; // 텍스트 노드 갱신
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
