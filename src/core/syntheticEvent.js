function createSyntheticEvent(nativeEvent) {
  const syntheticEvent = {
    nativeEvent,
    isDefaultPrevented: false,
    isPropagationStopped: false,
    preventDefault() {
      this.isDefaultPrevented = true;
      console.log("preventDefault 호출됨");
      nativeEvent.preventDefault();
    },
    stopPropagation() {
      this.isPropagationStopped = true;
      console.log("stopPropagation 호출됨");
      nativeEvent.stopPropagation();
    },
  };
  return syntheticEvent;
}

export { createSyntheticEvent };
