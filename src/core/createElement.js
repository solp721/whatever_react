function createElement(type, props, ...children) {
  // 함수형 컴포넌트인지 확인하고 즉시 실행
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  return {
    type,
    props: {
      ...props,
      children: children
        .flat()
        .map((child) =>
          typeof child === "object" ? child : createTextElement(child)
        ),
    },
  };
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

export { createElement };
