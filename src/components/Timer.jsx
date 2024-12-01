import { useState } from "../core/hooks/useState";
import { useEffect } from "../core/hooks/useEffect";

export default function Timer() {
  const [time, setTime] = useState(0); // 경과 시간 상태
  const [isRunning, setIsRunning] = useState(true); // 타이머 실행 여부 상태

  useEffect(() => {
    if (!isRunning) return; // 타이머가 중지된 경우 실행 안 함

    const interval = setInterval(() => {
      ㅇ;
      setTime((prev) => prev + 1); // 1초마다 시간 증가
    }, 1000);

    return () => {
      clearInterval(interval); // 언마운트 시 타이머 정리
      console.log("타이머 정리 완료");
    };
  }, [isRunning]); // isRunning이 변경될 때만 실행

  return (
    <div>
      <div>경과 시간: {time}초</div>
      <button onclick={() => setIsRunning((prev) => !prev)}>
        {isRunning ? "타이머 중지" : "타이머 시작"}
      </button>
    </div>
  );
}
