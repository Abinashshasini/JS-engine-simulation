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
  });

  let state = initialState();

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
      value: undefined,
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
    if (instructionPointer >= instructions.length) return getState();

    const instr = instructions[instructionPointer];

    try {
      switch (instr.type) {
        case 'PUSH_CONTEXT': {
          const parent = currentContext() || null;
          const ctx = createContext({
            type: instr.payload.type,
            name: instr.payload.name,
            outer: parent,
          });
          state.callStack.push(ctx);
          state.logs.push(`Context "${ctx.name}" created`);
          break;
        }

        case 'POP_CONTEXT': {
          const popped = state.callStack.pop();
          state.logs.push(`Context "${popped.name}" destroyed`);
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
          state.logs.push('Block entered');
          break;
        }

        case 'EXIT_BLOCK': {
          state.callStack.pop();
          state.logs.push('Block exited');
          break;
        }

        case 'DECLARE_VAR':
          declare(instr.payload.name, 'var');
          state.logs.push(`var ${instr.payload.name} hoisted`);
          break;

        case 'DECLARE_LET':
          declare(instr.payload.name, 'let');
          state.logs.push(`let ${instr.payload.name} created (TDZ)`);
          break;

        case 'DECLARE_CONST':
          declare(instr.payload.name, 'const');
          state.logs.push(`const ${instr.payload.name} created (TDZ)`);
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
          state.logs.push(`Function ${instr.payload.name} hoisted`);
          break;
        }

        case 'REGISTER_TIMEOUT': {
          const cb = instr.payload.callback;
          // register in webAPIs for visualization and push to macrotask queue
          const id = `t${Date.now()}${Math.random().toString(16).slice(2, 6)}`;
          state.webAPIs[id] = { type: 'timeout', callback: cb };
          state.macrotaskQueue.push({ id, type: 'timeout', callback: cb });
          state.logs.push(`setTimeout registered -> ${String(cb)}`);
          break;
        }

        case 'SCHEDULE_MICROTASK': {
          const cb = instr.payload.callback;
          state.microtaskQueue.push(cb);
          state.logs.push(`microtask scheduled -> ${String(cb)}`);
          break;
        }

        case 'EVENT_LOOP_TICK': {
          state.logs.push('--- event loop tick ---');

          // Flush microtasks fully
          while (state.microtaskQueue.length > 0) {
            const task = state.microtaskQueue.shift();

            // handle different task shapes
            if (typeof task === 'string') {
              state.logs.push(`console.log -> ${task}`);
            } else if (task && task.log) {
              state.logs.push(`console.log -> ${task.log}`);
              if (task.scheduleMicrotask) {
                state.microtaskQueue.push(task.scheduleMicrotask);
                state.logs.push(
                  `microtask scheduled -> ${task.scheduleMicrotask}`,
                );
              }
            } else if (typeof task === 'object' && task.callback) {
              // generic callback object
              state.logs.push(`microtask callback -> ${String(task.callback)}`);
            } else {
              state.logs.push(`microtask executed -> ${String(task)}`);
            }
          }

          // Run one macrotask if present
          if (state.macrotaskQueue.length > 0) {
            const macrotask = state.macrotaskQueue.shift();
            const cb = macrotask.callback;

            if (typeof cb === 'string') {
              state.logs.push(`console.log -> ${cb}`);
            } else if (typeof cb === 'object' && cb.log) {
              state.logs.push(`console.log -> ${cb.log}`);
            } else {
              state.logs.push(`macrotask executed -> ${String(cb)}`);
            }
            // remove from webAPIs visualization
            delete state.webAPIs[macrotask.id];
          }

          break;
        }

        case 'INITIALIZE':
          initialize(instr.payload.name, instr.payload.value);
          state.logs.push(
            `${instr.payload.name} initialized to ${instr.payload.value}`,
          );
          break;

        case 'ASSIGN':
          initialize(instr.payload.name, instr.payload.value);
          state.logs.push(
            `${instr.payload.name} assigned ${instr.payload.value}`,
          );
          break;

        case 'READ': {
          const value = read(instr.payload.name);
          state.logs.push(`${instr.payload.name} read -> ${value}`);
          break;
        }

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
          state.logs.push(`Function ${fn.name} called`);

          instructions.splice(instructionPointer + 1, 0, ...fn.body);
          break;
        }

        case 'RETURN':
          state.callStack.pop();
          state.logs.push('Function returned');
          break;

        case 'LOG':
          state.logs.push(`console.log -> ${instr.payload.value}`);
          break;

        default:
          state.logs.push('Unknown instruction');
      }
    } catch (err) {
      state.logs.push(err.message);
    }

    instructionPointer++;
    return getState();
  }

  function getState() {
    return {
      callStack: [...state.callStack],
      logs: [...state.logs],
    };
  }

  function hasNextStep() {
    return instructionPointer < instructions.length;
  }

  function reset() {
    instructionPointer = 0;
    state = initialState();
  }

  return { step, reset, hasNextStep, getState };
}
