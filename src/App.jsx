import { useEffect, useState, useCallback } from 'react';
import { scenarios } from './engine/scenarios';
import { useEngine } from './hooks/useEngine';
import { CodePanel } from './components/CodePanel';
import { MemoryPanel } from './components/MemoryPanel';
import { EventLoopPanel } from './components/EventLoopPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { LogsPanel } from './components/LogsPanel';
import { StepExplanation } from './components/StepExplanation';

function App() {
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-vscode-darker">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-vscode-panel border-b border-vscode-border shrink-0">
        {/* Left - Title & Scenario */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-vscode-text font-normal hidden md:inline">
            JS Engine
          </span>
          <select
            value={scenario.id}
            onChange={(e) =>
              selectScenario(scenarios.find((s) => s.id === e.target.value))
            }
            className="px-2 py-1.5 pr-8 text-xs bg-vscode-input border border-vscode-border rounded text-vscode-text cursor-pointer w-40 md:w-52 focus:outline-none focus:border-accent-blue appearance-none"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {completedScenarios.includes(s.id) ? '✓ ' : ''}
                {s.name}
              </option>
            ))}
          </select>
          <span
            className="text-[10px] text-vscode-comment hidden lg:inline"
            title="Progress"
          >
            {completedScenarios.length}/{scenarios.length} done
          </span>
        </div>

        {/* Center - Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={step}
            className="flex items-center justify-center w-9 h-8 bg-accent-blue text-white rounded text-sm hover:bg-blue-500 transition-colors"
            title="Next Step (Space / →)"
          >
            ▶
          </button>
          {isPlaying ? (
            <button
              onClick={stopAutoPlay}
              className="flex items-center justify-center w-9 h-8 bg-transparent text-vscode-text rounded text-sm hover:bg-vscode-hover transition-colors"
              title="Pause (P)"
            >
              ⏸
            </button>
          ) : (
            <button
              onClick={startAutoPlay}
              className="flex items-center justify-center w-9 h-8 bg-transparent text-vscode-text rounded text-sm hover:bg-vscode-hover transition-colors"
              title="Auto Play (P)"
            >
              ⏵⏵
            </button>
          )}
          <button
            onClick={reset}
            className="flex items-center justify-center w-9 h-8 bg-transparent text-vscode-text rounded text-sm hover:bg-vscode-hover transition-colors"
            title="Reset (R)"
          >
            ↺
          </button>
        </div>

        {/* Right - Phase, Step & Theme */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-[10px] rounded uppercase tracking-wide ${phaseStyles[engineState.phase] || phaseStyles.idle}`}
          >
            {phaseLabels[engineState.phase] || 'Ready'}
          </span>
          <span className="text-[11px] text-vscode-text-secondary hidden sm:inline">
            {engineState.stepCount}/{engineState.totalSteps}
          </span>
          <button
            onClick={toggleTheme}
            className="ml-1 w-7 h-7 flex items-center justify-center rounded hover:bg-vscode-hover text-sm"
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
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
