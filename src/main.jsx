import { render } from "./core/render";
import App from "./components/App";

const appElement = App();
console.log(
  "App의 가상돔을 확인해 보아요:",
  JSON.stringify(appElement, null, 2)
);

const container = document.getElementById("app"); // index.html의 #app 요소
render(appElement, container); // Virtual DOM -> 실제 DOM 렌더링
