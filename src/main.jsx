import { render } from "./core/render";
import App from "./components/App";
import { resetStateIndex, setRerenderFunc } from "./core/useState";

const container = document.getElementById("app");

function renderApp() {
  resetStateIndex();
  container.innerHTML = ""; // 이전 내용을 초기화
  const appElement = App();
  console.log(JSON.stringify(appElement, null, 2));
  render(appElement, container);
}

// 재렌더링 함수 설정
setRerenderFunc(renderApp);

// 초기 렌더링
renderApp();
