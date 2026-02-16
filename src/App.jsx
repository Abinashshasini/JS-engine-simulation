import { scenarios } from './engine/scenarios';
import { useEngine } from './hooks/useEngine';
import { CallStack } from './components/CallStack';
import { WebAPIs } from './components/WebAPIs';
import { MacrotaskQueue } from './components/MacrotaskQueue';
import { Logs } from './components/Logs';
import { MicrotaskQueue } from './components/MicrotaskQueue';

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
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>JS Event Loop Simulator</h1>

      {/* Scenario Selector */}
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

      <button onClick={step}>Next Step</button>

      {isPlaying ? (
        <button onClick={stopAutoPlay}>Pause</button>
      ) : (
        <button onClick={startAutoPlay}>Auto Play</button>
      )}

      <button onClick={reset}>Reset</button>

      <hr />

      {/* Code Panel */}
      <pre>{scenario.code}</pre>

      <hr />

      {/* Visualization Panels */}
      <div style={{ display: 'flex', gap: 40 }}>
        <CallStack stack={engineState.callStack} />
        <WebAPIs apis={engineState.webAPIs} />
        <MicrotaskQueue queue={engineState.microtaskQueue} />
        <MacrotaskQueue queue={engineState.macrotaskQueue} />
      </div>

      <Logs logs={engineState.logs} />
    </div>
  );
}

export default App;
