import { createSyntheticEvent } from "./SyntheticEvent";

function handleEvent(eventType, nativeEvent) {
  const syntheticEvent = createSyntheticEvent(nativeEvent); // Synthetic Event 생성
  let target = nativeEvent.target;

  console.log(`이벤트 처리 시작: ${eventType}, target:`, target);

  while (target) {
    const handler = target[eventType]; // 이벤트 핸들러 가져오기
    if (handler) {
      console.log(`핸들러 호출:`, handler);
      handler(syntheticEvent); // 핸들러 실행
      if (syntheticEvent.isPropagationStopped) {
        console.log("이벤트 전파 중지됨");
        break;
      }
    }
    target = target.parentNode; // 부모 노드로 이동
  }
}

let isDelegationActive = false;

function addEventDelegation(container) {
  if (isDelegationActive) return; // 중복 호출 방지
  isDelegationActive = true;

  container.addEventListener("click", (event) => handleEvent("onClick", event));
  container.addEventListener("input", (event) => handleEvent("onInput", event));
  console.log("이벤트 위임 활성화 완료");
}

export { addEventDelegation };
