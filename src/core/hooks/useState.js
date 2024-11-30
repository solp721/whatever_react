let state = [];
let stateIndex = 0;
let rerender = null;

export function useState(initialValue) {
  const currentIndex = stateIndex;

  // 상태 값 초기화 또는 기존 값 사용
  state[currentIndex] =
    state[currentIndex] !== undefined ? state[currentIndex] : initialValue;

  function setState(newValue) {
    state[currentIndex] = newValue;
    // 상태 변경 시 재렌더링 함수 호출
    rerender && rerender();
  }

  stateIndex++;

  return [state[currentIndex], setState];
}

export function resetStateIndex() {
  stateIndex = 0;
}

export function setRerenderFunc(rerenderFunc) {
  rerender = rerenderFunc;
}
