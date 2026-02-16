import { useState, useRef, useEffect } from 'react';
import { createEngine } from '../engine/createEngine';

export function useEngine(initialScenario) {
  const engineRef = useRef(createEngine(initialScenario));
  const intervalRef = useRef(null);

  const [scenario, setScenario] = useState(initialScenario);
  const [engineState, setEngineState] = useState(engineRef.current.getState());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    engineRef.current = createEngine(scenario);
    setEngineState(engineRef.current.getState());
    stopAutoPlay();
  }, [scenario]);

  function step() {
    if (!engineRef.current.hasNextStep()) {
      stopAutoPlay();
      return;
    }

    const updated = engineRef.current.step();
    setEngineState(updated);
  }

  function startAutoPlay() {
    if (intervalRef.current) return;

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      if (!engineRef.current.hasNextStep()) {
        stopAutoPlay();
        return;
      }
      const updated = engineRef.current.step();
      setEngineState(updated);
    }, 800);
  }

  function stopAutoPlay() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
  }

  function reset() {
    stopAutoPlay();
    engineRef.current.reset();
    setEngineState(engineRef.current.getState());
  }

  function selectScenario(newScenario) {
    setScenario(newScenario);
  }

  return {
    engineState,
    step,
    reset,
    selectScenario,
    scenario,
    startAutoPlay,
    stopAutoPlay,
    isPlaying,
  };
}
