import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scenarios } from './engine/scenarios';
import { useEngine } from './hooks/useEngine';
import { CodePanel } from './components/CodePanel';
import { MemoryPanel } from './components/MemoryPanel';
import { EventLoopPanel } from './components/EventLoopPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { LogsPanel } from './components/LogsPanel';
import { StepExplanation } from './components/StepExplanation';
import { LandingPage } from './components/LandingPage';

function App() {
  const [showLanding, setShowLanding] = useState(() => {
    return localStorage.getItem('jsengine-visited') !== 'true';
  });

  const {
    engineState,
    step,
    reset,
    selectScenario,
    scenario,
    isPlaying,
    startAutoPlay,
    stopAutoPlay,
    completedScenarios,
  } = useEngine(scenarios[0]);

  const [theme, setTheme] = useState(
    () => localStorage.getItem('jsengine-theme') || 'dark',
  );

  const handleStart = () => {
    localStorage.setItem('jsengine-visited', 'true');
    setShowLanding(false);
  };

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jsengine-theme', theme);
  }, [theme]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          step();
          break;
        case 'r':
        case 'R':
          reset();
          break;
        case 'p':
        case 'P':
          isPlaying ? stopAutoPlay() : startAutoPlay();
          break;
        case 'ArrowRight':
          step();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex =
            scenarios.findIndex((s) => s.id === scenario.id) - 1;
          if (prevIndex >= 0) selectScenario(scenarios[prevIndex]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex =
            scenarios.findIndex((s) => s.id === scenario.id) + 1;
          if (nextIndex < scenarios.length)
            selectScenario(scenarios[nextIndex]);
          break;
      }
    },
    [
      step,
      reset,
      isPlaying,
      startAutoPlay,
      stopAutoPlay,
      scenario,
      selectScenario,
    ],
  );

  useEffect(() => {
    if (!showLanding) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, showLanding]);

  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  if (!engineState) return null;

  const phaseStyles = {
    idle: 'bg-vscode-input text-vscode-text-secondary',
    creation: 'bg-blue-900/50 text-accent-cyan',
    execution: 'bg-yellow-900/50 text-accent-yellow',
    'event-loop': 'bg-purple-900/50 text-accent-purple',
    done: 'bg-green-900/50 text-accent-green',
  };

  const phaseLabels = {
    idle: 'Ready',
    creation: 'Creation',
    execution: 'Execution',
    'event-loop': 'Event Loop',
    done: 'Done',
  };

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const progressPct =
    engineState.totalSteps > 0
      ? Math.round((engineState.stepCount / engineState.totalSteps) * 100)
      : 0;

  const isExecutionComplete =
    engineState.phase === 'done' ||
    engineState.stepCount >= engineState.totalSteps;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-vscode-darker">
      {/* Top Bar */}
      <div className="shrink-0">
        <div className="grid grid-cols-3 px-3 py-2 bg-vscode-panel border-b border-vscode-border">
          {/* Left - Title & Scenario */}
          <div className="flex items-center justify-start gap-3">
            <span className="text-sm text-vscode-text font-normal hidden md:inline">
              <span className="text-accent-yellow">⚡</span> JS Engine
            </span>
            <div className="relative group">
              <select
                value={scenario.id}
                onChange={(e) =>
                  selectScenario(scenarios.find((s) => s.id === e.target.value))
                }
                className="px-3 py-2 pr-9 text-xs bg-vscode-input border border-vscode-border rounded-md text-vscode-text cursor-pointer w-44 md:w-60 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 hover:border-accent-blue/50 appearance-none transition-all duration-200 font-medium"
              >
                {scenarios.map((s) => {
                  const isCurrent = s.id === scenario.id;
                  return (
                    <option key={s.id} value={s.id}>
                      {isCurrent ? '▶ ' : '  '}
                      {s.name}
                    </option>
                  );
                })}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-vscode-text-muted group-hover:text-accent-blue transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Completion badge */}
              {completedScenarios.includes(scenario.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-blue rounded-full flex items-center justify-center shadow-lg shadow-accent-blue/50"
                  title="Completed"
                >
                  <span className="text-[7px] text-white font-bold">✓</span>
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] text-vscode-comment hidden lg:inline tabular-nums"
                title="Completed Scenarios"
              >
                {completedScenarios.length}/{scenarios.length}
              </span>
              <div className="hidden lg:flex items-center gap-0.5">
                {Array.from({ length: Math.min(5, scenarios.length) }).map(
                  (_, i) => {
                    const progress =
                      (completedScenarios.length / scenarios.length) * 5;
                    return (
                      <div
                        key={i}
                        className={`w-1 h-2 rounded-full transition-all duration-300 ${
                          i < progress ? 'bg-accent-blue' : 'bg-vscode-border'
                        }`}
                      />
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* Center - Controls */}
          <div className="flex items-center justify-center gap-1.5">
            {!isExecutionComplete && (
              <>
                {isPlaying ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={stopAutoPlay}
                    className="flex items-center justify-center w-9 h-8 bg-transparent text-vscode-text rounded text-sm hover:bg-vscode-hover transition-colors"
                    title="Pause (P)"
                  >
                    ⏸
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startAutoPlay}
                    className="flex items-center justify-center w-9 h-8 bg-transparent text-vscode-text rounded text-sm hover:bg-vscode-hover transition-colors"
                    title="Auto Play (P)"
                  >
                    ⏵⏵
                  </motion.button>
                )}
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={step}
              className="flex items-center justify-center w-9 h-8 bg-accent-blue text-white rounded text-sm hover:bg-blue-500 transition-colors shadow-md shadow-accent-blue/30"
              title="Next Step (Space / →)"
              style={{ pointerEvents: isExecutionComplete ? 'none' : 'auto' }}
            >
              ▶
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: -180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              onClick={reset}
              className="flex items-center justify-center w-9 h-8 bg-transparent text-vscode-text rounded text-sm hover:bg-vscode-hover transition-colors"
              title="Reset (R)"
            >
              ↺
            </motion.button>
          </div>

          {/* Right - Phase, Step & Theme */}
          <div className="flex items-center justify-end gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={engineState.phase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`px-2 py-1 text-[10px] rounded uppercase tracking-wide ${
                  engineState.phase !== 'idle' && engineState.phase !== 'done'
                    ? 'animate-phase-pulse'
                    : ''
                } ${phaseStyles[engineState.phase] || phaseStyles.idle}`}
              >
                {phaseLabels[engineState.phase] || 'Ready'}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] text-vscode-text-secondary hidden sm:inline tabular-nums min-w-[44px] text-right">
              {engineState.stepCount}/{engineState.totalSteps}
            </span>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="ml-1 w-7 h-7 flex items-center justify-center rounded hover:bg-vscode-hover text-sm"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-0.5 bg-vscode-border relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-accent-blue"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          {isPlaying && <div className="absolute inset-0 animate-shimmer" />}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Section - Code + Memory + Event Loop */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Row - Code, Memory, Event Loop */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <CodePanel
              code={scenario.code}
              currentLine={engineState.currentLine}
            />
            <MemoryPanel
              contexts={engineState.callStack}
              phase={engineState.phase}
            />
            <EventLoopPanel
              callStack={engineState.callStack}
              webAPIs={engineState.webAPIs}
              microtaskQueue={engineState.microtaskQueue}
              macrotaskQueue={engineState.macrotaskQueue}
            />
          </div>

          {/* Bottom Panel - Console & Logs */}
          <div className="flex h-36 md:h-44 lg:h-48 border-t border-vscode-border shrink-0">
            <ConsolePanel logs={engineState.logs} />
            <LogsPanel logs={engineState.logs} />
          </div>
        </div>

        {/* Right Panel - Full Explanation (desktop only) */}
        <div className="hidden lg:flex w-80 xl:w-96 border-l border-vscode-border flex-col bg-vscode-panel">
          <div className="flex items-center h-8 px-3 bg-vscode-sidebar border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
            <span className="mr-1.5">💡</span>
            Explanation
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            <StepExplanation explanation={engineState.currentExplanation} />
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint (mobile) */}
      <div className="md:hidden text-center py-1 text-[10px] text-vscode-comment bg-vscode-panel border-t border-vscode-border">
        Tap Step to advance • Swipe up/down for scenarios
      </div>
    </div>
  );
}

export default App;
