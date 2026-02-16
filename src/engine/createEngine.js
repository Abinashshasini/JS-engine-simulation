import { explanations } from './explanations';

export function createEngine(scenario) {
  let instructionPointer = 0;
  const instructions = [...scenario.instructions];
  let contextId = 1;

  const initialState = () => ({
    callStack: [],
    logs: [],
    microtaskQueue: [],
    macrotaskQueue: [],
    webAPIs: {},
    phase: 'idle',
    currentLine: -1,
    stepCount: 0,
    currentExplanation: null,
  });

  let state = initialState();

  // Step explanations are loaded from src/engine/explanations.js

  // -----------------------------------
  // Execution Context Factory
  // -----------------------------------

  function createContext({ type, name, outer }) {
    const ctx = {
      id: `${name}-${contextId++}`,
      type,
      name,
      variableEnvironment: {},
      lexicalEnvironment: {},
      outer: outer || null,
      thisBinding: type === 'global' ? { type: 'window' } : undefined,
    };

    return ctx;
  }

  function currentContext() {
    return state.callStack[state.callStack.length - 1];
  }

  // -----------------------------------
  // Variable Resolution
  // -----------------------------------

  function resolve(name) {
    let ctx = currentContext();

    while (ctx) {
      if (ctx.lexicalEnvironment[name]) return ctx.lexicalEnvironment[name];
      if (ctx.variableEnvironment[name]) return ctx.variableEnvironment[name];
      ctx = ctx.outer;
    }

    throw new Error(`ReferenceError: ${name} is not defined`);
  }

  function declare(name, kind) {
    const ctx = currentContext();

    const record = {
      kind,
      initialized: kind === 'var' || kind === 'function',
      value: kind === 'var' ? undefined : undefined,
    };

    if (kind === 'var' || kind === 'function') {
      ctx.variableEnvironment[name] = record;
    } else {
      ctx.lexicalEnvironment[name] = record;
    }
  }

  function initialize(name, value) {
    const record = resolve(name);

    if (record.kind === 'const' && record.initialized) {
      throw new Error('TypeError: Assignment to constant variable');
    }

    record.initialized = true;
    record.value = value;
  }

  function read(name) {
    const record = resolve(name);

    if (!record.initialized) {
      throw new Error(
        `ReferenceError: Cannot access '${name}' before initialization`,
      );
    }

    return record.value;
  }

  // -----------------------------------
  // Engine Step
  // -----------------------------------

  function step() {
    if (instructionPointer >= instructions.length) {
      state.phase = 'done';
      state.currentExplanation = {
        title: 'Execution Complete',
        description: 'All synchronous and asynchronous code has been executed.',
        concept: null,
      };
      return getState();
    }

    const instr = instructions[instructionPointer];
    state.stepCount++;

    // Set explanation for current instruction
    state.currentExplanation = explanations[instr.type] || {
      title: instr.type,
      description: 'Executing instruction...',
      concept: null,
    };

    // Update current line if instruction has it
    if (instr.line !== undefined) {
      state.currentLine = instr.line;
    }

    try {
      switch (instr.type) {
        // ============ PHASE MARKERS ============
        case 'PHASE_CREATION':
          state.phase = 'creation';
          state.logs.push('📦 CREATION PHASE - Memory Allocation');
          break;

        case 'PHASE_EXECUTION':
          state.phase = 'execution';
          state.logs.push('▶️ EXECUTION PHASE - Running Code');
          break;

        case 'PHASE_EVENT_LOOP':
          state.phase = 'event-loop';
          state.logs.push('🔄 EVENT LOOP - Processing Queues');
          break;

        // ============ CONTEXT MANAGEMENT ============
        case 'PUSH_CONTEXT': {
          const parent = currentContext() || null;
          const ctx = createContext({
            type: instr.payload.type,
            name: instr.payload.name,
            outer: parent,
          });
          state.callStack.push(ctx);
          state.logs.push(
            `🏗️ ${ctx.type.toUpperCase()} Execution Context created: "${ctx.name}"`,
          );
          break;
        }

        case 'POP_CONTEXT': {
          const popped = state.callStack.pop();
          state.logs.push(`🗑️ Context "${popped.name}" destroyed`);
          break;
        }

        case 'ENTER_BLOCK': {
          const parent = currentContext();
          const block = createContext({
            type: 'block',
            name: 'block',
            outer: parent,
          });
          state.callStack.push(block);
          state.logs.push('↳ Block scope entered');
          break;
        }

        case 'EXIT_BLOCK': {
          state.callStack.pop();
          state.logs.push('↲ Block scope exited');
          break;
        }

        // ============ VARIABLE DECLARATIONS ============
        case 'DECLARE_VAR':
          declare(instr.payload.name, 'var');
          state.logs.push(
            `📝 var "${instr.payload.name}" → memory allocated (value: undefined)`,
          );
          break;

        case 'DECLARE_LET':
          declare(instr.payload.name, 'let');
          state.logs.push(
            `📝 let "${instr.payload.name}" → memory allocated (TDZ - cannot access yet)`,
          );
          break;

        case 'DECLARE_CONST':
          declare(instr.payload.name, 'const');
          state.logs.push(
            `📝 const "${instr.payload.name}" → memory allocated (TDZ - cannot access yet)`,
          );
          break;

        case 'DECLARE_FUNCTION': {
          const ctx = currentContext();
          ctx.variableEnvironment[instr.payload.name] = {
            kind: 'function',
            initialized: true,
            value: {
              name: instr.payload.name,
              body: instr.payload.body,
              environment: ctx,
            },
          };
          state.logs.push(
            `📝 function "${instr.payload.name}" → memory allocated (fully hoisted)`,
          );
          break;
        }

        // ============ VARIABLE OPERATIONS ============
        case 'INITIALIZE':
          initialize(instr.payload.name, instr.payload.value);
          state.logs.push(
            `✏️ "${instr.payload.name}" initialized to ${JSON.stringify(instr.payload.value)}`,
          );
          break;

        case 'ASSIGN':
          initialize(instr.payload.name, instr.payload.value);
          state.logs.push(
            `✏️ "${instr.payload.name}" = ${JSON.stringify(instr.payload.value)}`,
          );
          break;

        case 'READ': {
          const value = read(instr.payload.name);
          state.logs.push(
            `📖 Read "${instr.payload.name}" → ${JSON.stringify(value)}`,
          );
          break;
        }

        // ============ FUNCTION CALLS ============
        case 'CALL_FUNCTION': {
          const fnRecord = resolve(instr.payload.name);
          const fn = fnRecord.value;

          const newCtx = createContext({
            type: 'function',
            name: fn.name,
            outer: fn.environment,
          });

          newCtx.thisBinding = undefined;

          state.callStack.push(newCtx);
          state.logs.push(`📞 Calling function "${fn.name}()"`);

          // Insert function body instructions
          instructions.splice(instructionPointer + 1, 0, ...fn.body);
          break;
        }

        case 'RETURN': {
          const returnedCtx = state.callStack.pop();
          state.logs.push(
            `↩️ Function "${returnedCtx?.name || 'anonymous'}" returned`,
          );
          break;
        }

        // ============ CONSOLE.LOG ============
        case 'LOG':
          state.logs.push(`📢 console.log("${instr.payload.value}")`);
          break;

        // ============ ASYNC OPERATIONS ============
        case 'REGISTER_TIMEOUT': {
          const cb = instr.payload.callback;
          const delay = instr.payload.delay || 0;
          const id = `timeout-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

          state.webAPIs[id] = { type: 'setTimeout', callback: cb, delay };
          state.macrotaskQueue.push({ id, type: 'setTimeout', callback: cb });
          state.logs.push(
            `⏰ setTimeout(callback, ${delay}) → registered in Web APIs`,
          );
          break;
        }

        case 'SCHEDULE_MICROTASK': {
          const cb = instr.payload.callback;
          state.microtaskQueue.push(cb);
          state.logs.push(
            `🔹 Microtask scheduled: ${typeof cb === 'string' ? cb : 'callback'}`,
          );
          break;
        }

        case 'EVENT_LOOP_TICK': {
          state.logs.push('━━━ Event Loop Tick ━━━');

          // Flush all microtasks first
          while (state.microtaskQueue.length > 0) {
            const task = state.microtaskQueue.shift();

            if (typeof task === 'string') {
              state.logs.push(`   🔹 Microtask: console.log("${task}")`);
            } else if (task && task.log) {
              state.logs.push(`   🔹 Microtask: console.log("${task.log}")`);
              if (task.scheduleMicrotask) {
                state.microtaskQueue.push(task.scheduleMicrotask);
                state.logs.push(
                  `   🔹 Nested microtask scheduled: ${task.scheduleMicrotask}`,
                );
              }
            } else if (typeof task === 'object' && task.callback) {
              state.logs.push(`   🔹 Microtask callback executed`);
            } else {
              state.logs.push(`   🔹 Microtask executed: ${String(task)}`);
            }
          }

          // Then run ONE macrotask
          if (state.macrotaskQueue.length > 0) {
            const macrotask = state.macrotaskQueue.shift();
            const cb = macrotask.callback;

            if (typeof cb === 'string') {
              state.logs.push(`   ⬛ Macrotask: console.log("${cb}")`);
            } else if (typeof cb === 'object' && cb.log) {
              state.logs.push(`   ⬛ Macrotask: console.log("${cb.log}")`);
            } else {
              state.logs.push(`   ⬛ Macrotask executed`);
            }

            // Remove from webAPIs if exists
            delete state.webAPIs[macrotask.id];
          }

          break;
        }

        default:
          state.logs.push(`❓ Unknown instruction: ${instr.type}`);
      }
    } catch (err) {
      state.logs.push(`❌ ${err.message}`);
    }

    instructionPointer++;
    return getState();
  }

  function getState() {
    return {
      callStack: state.callStack.map((ctx) => ({
        ...ctx,
        variableEnvironment: { ...ctx.variableEnvironment },
        lexicalEnvironment: { ...ctx.lexicalEnvironment },
      })),
      logs: [...state.logs],
      microtaskQueue: [...state.microtaskQueue],
      macrotaskQueue: [...state.macrotaskQueue],
      webAPIs: { ...state.webAPIs },
      phase: state.phase,
      currentLine: state.currentLine,
      stepCount: state.stepCount,
      totalSteps: instructions.length,
      currentExplanation: state.currentExplanation,
    };
  }

  function hasNextStep() {
    return instructionPointer < instructions.length;
  }

  function reset() {
    instructionPointer = 0;
    contextId = 1;
    instructions.length = 0;
    instructions.push(...scenario.instructions);
    state = initialState();
  }

  return { step, reset, hasNextStep, getState };
}
