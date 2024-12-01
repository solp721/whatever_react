let state = []; // 상태 저장소
let stateIndex = 0; // 현재 상태 인덱스
let rerender = null; // 재렌더링 함수 참조

/**
 * useState 훅
 * @param {any} initialValue 초기 상태 값
 * @returns {[any, Function]} 현재 상태와 상태 업데이트 함수
 */
export function useState(initialValue) {
  const currentIndex = stateIndex;

  // 상태 값 초기화 또는 기존 값 사용
  state[currentIndex] =
    state[currentIndex] !== undefined ? state[currentIndex] : initialValue;

  function setState(newValue) {
    // newValue가 함수라면 현재 상태를 인자로 전달해 계산
    state[currentIndex] =
      typeof newValue === "function" ? newValue(state[currentIndex]) : newValue;

    // 상태 변경 시 재렌더링 함수 호출
    rerender && rerender();
  }

  stateIndex++;

  return [state[currentIndex], setState];
}

/**
 * 상태 인덱스 초기화
 * 컴포넌트 렌더링 전에 호출
 */
export function resetStateIndex() {
  stateIndex = 0;
}

/**
 * 재렌더링 함수 설정
 * @param {Function} rerenderFunc 재렌더링 함수
 */
export function setRerenderFunc(rerenderFunc) {
  rerender = rerenderFunc;
}
