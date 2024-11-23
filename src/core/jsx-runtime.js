import { createElement } from "./createElement";

export function jsx(type, props, key) {
  props = props || {};
  const { children = [], ...rest } = props;
  const childArray = Array.isArray(children) ? children : [children];
  return createElement(type, { ...rest, key }, ...childArray);
}

export function jsxs(type, props, key) {
  return jsx(type, props, key);
}
