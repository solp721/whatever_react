function createElement(type, props, ...children) {
  // 함수형 컴포넌트인지 확인
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  const element = {
    type,
    ref: props?.ref || null,
    key: props?.key || null,
    props: {
      ...props,
      children: children
        .flat()
        .map((child) =>
          typeof child === "object" ? child : createTextElement(String(child))
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

export { createElement };
