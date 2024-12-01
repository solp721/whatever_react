let effects = []; // 모든 Effect 저장소
let currentEffectIndex = 0; // 현재 Effect 인덱스

/**
 * useEffect 훅
 * @param {Function} callback - 실행할 사이드 이펙트 함수
 * @param {Array} deps - 의존성 배열
 */
function useEffect(callback, deps) {
  const prevEffect = effects[currentEffectIndex];
  const hasChanged =
    !prevEffect || !deps.every((dep, i) => dep === prevEffect.deps[i]);

  if (hasChanged) {
    if (prevEffect && prevEffect.cleanup) {
      prevEffect.cleanup(); // 이전 클린업 함수 호출
    }
    const cleanup = callback(); // 새로운 Effect 실행
    effects[currentEffectIndex] = { deps, cleanup };
  }

  currentEffectIndex++;
}

/**
 * Effect Index 초기화
 */
function resetEffectIndex() {
  currentEffectIndex = 0;
}

/**
 * 저장된 Effect 실행
 */
function runEffects() {
  effects.forEach((effect) => {
    if (effect.cleanup) effect.cleanup(); // 기존 클린업 실행
    effect.cleanup = effect.callback?.(); // 새로운 Effect 실행
  });
}

export { useEffect, resetEffectIndex, runEffects };
