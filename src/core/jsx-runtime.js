import { createElement } from "./createElement";

export function jsx(type, props, key) {
  return createElement(type, { ...props, key }, ...(props?.children || []));
}

export function jsxs(type, props, key) {
  return createElement(type, { ...props, key }, ...(props?.children || []));
}
