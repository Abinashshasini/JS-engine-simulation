export const explanations = {
  PHASE_CREATION: {
    title: 'Creation Phase',
    description:
      'JavaScript engine scans the code and allocates memory for variables and functions BEFORE executing any code.',
    concept: 'hoisting',
  },
  PHASE_EXECUTION: {
    title: 'Execution Phase',
    description:
      'Now the engine executes code line by line, assigning values and running functions.',
    concept: 'execution-context',
  },
  PHASE_EVENT_LOOP: {
    title: 'Event Loop Phase',
    description:
      'Call stack is empty! Event loop checks queues: microtasks first (Promises), then one macrotask (setTimeout).',
    concept: 'event-loop',
  },
  PUSH_CONTEXT: {
    title: 'Execution Context Created',
    description:
      'A new execution context is pushed onto the call stack. It has its own variable environment and scope chain.',
    concept: 'execution-context',
  },
  DECLARE_VAR: {
    title: 'var Declaration (Hoisted)',
    description:
      'var is hoisted to the top and initialized with undefined. You can access it before the declaration line (but it will be undefined).',
    concept: 'hoisting',
  },
  DECLARE_LET: {
    title: 'let Declaration (TDZ)',
    description:
      'let is hoisted but NOT initialized. Accessing it before declaration throws ReferenceError. This is the Temporal Dead Zone (TDZ).',
    concept: 'tdz',
  },
  DECLARE_CONST: {
    title: 'const Declaration (TDZ)',
    description:
      'const behaves like let (TDZ) but cannot be reassigned after initialization.',
    concept: 'tdz',
  },
  DECLARE_FUNCTION: {
    title: 'Function Declaration (Fully Hoisted)',
    description:
      'Function declarations are fully hoisted - both the name AND the function body are available immediately.',
    concept: 'hoisting',
  },
  INITIALIZE: {
    title: 'Variable Initialization',
    description:
      'The variable is now assigned its value. For let/const, this exits the TDZ.',
    concept: 'execution-context',
  },
  CALL_FUNCTION: {
    title: 'Function Call',
    description:
      'A new function execution context is created and pushed onto the call stack. The function has access to its outer scope via closure.',
    concept: 'closure',
  },
  RETURN: {
    title: 'Function Return',
    description:
      'The function completes and its execution context is popped from the call stack.',
    concept: 'execution-context',
  },
  REGISTER_TIMEOUT: {
    title: 'setTimeout Registered',
    description:
      'setTimeout is a Web API. The callback is sent to the browser, which starts a timer. When done, it goes to the macrotask queue.',
    concept: 'event-loop',
  },
  SCHEDULE_MICROTASK: {
    title: 'Microtask Scheduled',
    description:
      'Promise callbacks (.then/.catch) go to the microtask queue. Microtasks run BEFORE the next macrotask.',
    concept: 'microtask',
  },
  EVENT_LOOP_TICK: {
    title: 'Event Loop Tick',
    description:
      'The event loop: 1) Run all microtasks until empty, 2) Run ONE macrotask, 3) Repeat.',
    concept: 'event-loop',
  },
  LOG: {
    title: 'Console Output',
    description:
      'console.log() is executed synchronously, outputting to the console immediately.',
    concept: 'execution-context',
  },
  POP_CONTEXT: {
    title: 'Context Destroyed (GC Eligible)',
    description:
      'The execution context is removed from the call stack. Variables in this context become eligible for garbage collection unless kept alive by closures.',
    concept: 'garbage-collection',
  },
  EXIT_BLOCK: {
    title: 'Block Scope Exited (GC Eligible)',
    description:
      'Block-scoped variables (let/const) go out of scope and become eligible for garbage collection if not referenced elsewhere.',
    concept: 'garbage-collection',
  },
};
