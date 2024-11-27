import { render } from "./core/render";
import App from "./components/App";
import { resetStateIndex, setRerenderFunc } from "./core/useState";
import { addEventDelegation } from "./core/addEventDelegation";

const container = document.getElementById("app");

/**
 * @description 애플리케이션 렌더링
 */
function renderApp() {
  resetStateIndex();
  const appElement = App(); // Virtual DOM 생성
  render(appElement, container); // Virtual DOM 렌더링
  console.log(JSON.stringify(appElement, null, 2));
}

// 이벤트 위임 활성화
addEventDelegation(container);

// 재렌더링 함수 설정
setRerenderFunc(renderApp);

// 초기 렌더링
renderApp();
