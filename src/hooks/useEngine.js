import { useState, useRef, useEffect, useCallback } from 'react';
import { createEngine } from '../engine/createEngine';

export function useEngine(initialScenario) {
  const engineRef = useRef(createEngine(initialScenario));
  const intervalRef = useRef(null);

  const [scenario, setScenario] = useState(initialScenario);
  const [engineState, setEngineState] = useState(engineRef.current.getState());
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5, 1, 2, 3
  const [completedScenarios, setCompletedScenarios] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jsengine-completed') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    engineRef.current = createEngine(scenario);
    setEngineState(engineRef.current.getState());
    stopAutoPlay();
  }, [scenario]);

  // Save completed scenarios to localStorage
  useEffect(() => {
    localStorage.setItem(
      'jsengine-completed',
      JSON.stringify(completedScenarios),
    );
  }, [completedScenarios]);

  const step = useCallback(() => {
    if (!engineRef.current.hasNextStep()) {
      stopAutoPlay();
      // Mark scenario as completed
      if (!completedScenarios.includes(scenario.id)) {
        setCompletedScenarios((prev) => [...prev, scenario.id]);
      }
      return;
    }

    const updated = engineRef.current.step();
    setEngineState(updated);
  }, [scenario.id, completedScenarios]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) return;

    setIsPlaying(true);
    const interval = Math.round(800 / speed);

    intervalRef.current = setInterval(() => {
      if (!engineRef.current.hasNextStep()) {
        stopAutoPlay();
        return;
      }
      const updated = engineRef.current.step();
      setEngineState(updated);
    }, interval);
  }, [speed]);

  const stopAutoPlay = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
  }, []);

  // Update interval when speed changes during playback
  useEffect(() => {
    if (isPlaying) {
      stopAutoPlay();
      startAutoPlay();
    }
  }, [speed]);

  const reset = useCallback(() => {
    stopAutoPlay();
    engineRef.current.reset();
    setEngineState(engineRef.current.getState());
  }, [stopAutoPlay]);

  const selectScenario = useCallback((newScenario) => {
    setScenario(newScenario);
  }, []);

  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
  }, []);

  return {
    engineState,
    step,
    reset,
    selectScenario,
    scenario,
    startAutoPlay,
    stopAutoPlay,
    isPlaying,
    speed,
    changeSpeed,
    completedScenarios,
  };
}
