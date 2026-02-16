import { scenarios } from './engine/scenarios';
import { useEngine } from './hooks/useEngine';
import { CodePanel } from './components/CodePanel';
import { MemoryAllocation } from './components/MemoryAllocation';
import { ExecutionPhaseIndicator } from './components/ExecutionPhaseIndicator';
import { CallStack } from './components/CallStack';
import { WebAPIs } from './components/WebAPIs';
import { MacrotaskQueue } from './components/MacrotaskQueue';
import { MicrotaskQueue } from './components/MicrotaskQueue';
import { Logs } from './components/Logs';
import './App.css';

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
  } = useEngine(scenarios[0]);

  if (!engineState) return null;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>🚀 JavaScript Engine Simulator</h1>
        <p className="subtitle">
          Visualize execution contexts, memory allocation, and event loop
        </p>
      </header>

      {/* Controls */}
      <div className="controls-bar">
        <div className="scenario-selector">
          <label>Scenario:</label>
          <select
            value={scenario.id}
            onChange={(e) =>
              selectScenario(scenarios.find((s) => s.id === e.target.value))
            }
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-buttons">
          <button onClick={step} className="btn btn-primary">
            ▶ Next Step
          </button>

          {isPlaying ? (
            <button onClick={stopAutoPlay} className="btn btn-warning">
              ⏸ Pause
            </button>
          ) : (
            <button onClick={startAutoPlay} className="btn btn-success">
              ⏵ Auto Play
            </button>
          )}

          <button onClick={reset} className="btn btn-secondary">
            ↺ Reset
          </button>
        </div>

        <div className="scenario-description">{scenario.description}</div>
      </div>

      {/* Phase Indicator */}
      <ExecutionPhaseIndicator
        phase={engineState.phase}
        stepCount={engineState.stepCount}
        totalSteps={engineState.totalSteps}
      />

      {/* Main Content - Split Layout */}
      <div className="main-content">
        {/* Left Panel - Code */}
        <div className="left-panel">
          <CodePanel
            code={scenario.code}
            currentLine={engineState.currentLine}
            phase={engineState.phase}
          />
        </div>

        {/* Center Panel - Memory & Call Stack */}
        <div className="center-panel">
          <MemoryAllocation
            contexts={engineState.callStack}
            phase={engineState.phase}
          />
        </div>

        {/* Right Panel - Event Loop */}
        <div className="right-panel">
          <div className="event-loop-section">
            <h3 className="section-title">🔄 Event Loop</h3>

            <div className="queues-container">
              <CallStack stack={engineState.callStack} />
              <WebAPIs apis={engineState.webAPIs} />
              <MicrotaskQueue queue={engineState.microtaskQueue} />
              <MacrotaskQueue queue={engineState.macrotaskQueue} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Logs */}
      <div className="logs-section">
        <Logs logs={engineState.logs} />
      </div>
    </div>
  );
}

export default App;
