export const scenarios = [
  // --------------------------------------------------
  // 1️⃣ Synchronous Execution with var/let/const
  // --------------------------------------------------
  {
    id: 'sync-hoisting',
    name: '1. var/let/const & Hoisting',
    description: 'Memory allocation differences: var vs let/const and TDZ.',
    code: `var a = 10;
let b = 20;
const c = 30;

function greet() {
  console.log("Hello");
}

console.log(a);
greet();`,
    instructions: [
      // Phase 1: Creation
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      { type: 'DECLARE_VAR', payload: { name: 'a' }, line: 0 },
      { type: 'DECLARE_LET', payload: { name: 'b' }, line: 1 },
      { type: 'DECLARE_CONST', payload: { name: 'c' }, line: 2 },
      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'greet',
          body: [
            { type: 'LOG', payload: { value: 'Hello' }, line: 5 },
            { type: 'RETURN' },
          ],
        },
        line: 4,
      },

      // Phase 2: Execution
      { type: 'PHASE_EXECUTION' },
      { type: 'INITIALIZE', payload: { name: 'a', value: 10 }, line: 0 },
      { type: 'INITIALIZE', payload: { name: 'b', value: 20 }, line: 1 },
      { type: 'INITIALIZE', payload: { name: 'c', value: 30 }, line: 2 },
      { type: 'LOG', payload: { value: '10' }, line: 8 },
      { type: 'CALL_FUNCTION', payload: { name: 'greet' }, line: 9 },
      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 2️⃣ Function Execution Context
  // --------------------------------------------------
  {
    id: 'function-context',
    name: '2. Function Execution Context',
    description: 'New context created when function is called.',
    code: `function outer() {
  var x = 5;
  
  function inner() {
    var y = 10;
    console.log(x + y);
  }
  
  inner();
}

outer();`,
    instructions: [
      // Creation Phase
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'outer',
          body: [
            { type: 'PHASE_CREATION' },
            { type: 'DECLARE_VAR', payload: { name: 'x' }, line: 1 },
            {
              type: 'DECLARE_FUNCTION',
              payload: {
                name: 'inner',
                body: [
                  { type: 'PHASE_CREATION' },
                  { type: 'DECLARE_VAR', payload: { name: 'y' }, line: 4 },
                  { type: 'PHASE_EXECUTION' },
                  {
                    type: 'INITIALIZE',
                    payload: { name: 'y', value: 10 },
                    line: 4,
                  },
                  { type: 'LOG', payload: { value: '15' }, line: 5 },
                  { type: 'RETURN' },
                ],
              },
              line: 3,
            },
            { type: 'PHASE_EXECUTION' },
            { type: 'INITIALIZE', payload: { name: 'x', value: 5 }, line: 1 },
            { type: 'CALL_FUNCTION', payload: { name: 'inner' }, line: 8 },
            { type: 'RETURN' },
          ],
        },
        line: 0,
      },

      // Execution Phase
      { type: 'PHASE_EXECUTION' },
      { type: 'CALL_FUNCTION', payload: { name: 'outer' }, line: 11 },
      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 3️⃣ setTimeout(0)
  // --------------------------------------------------
  {
    id: 'timeout-basic',
    name: '3. setTimeout(0)',
    description: 'Macrotask queue demonstration.',
    code: `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },

      { type: 'PHASE_EXECUTION' },
      { type: 'LOG', payload: { value: 'A' }, line: 0 },
      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: 'B', delay: 0 },
        line: 2,
      },
      { type: 'LOG', payload: { value: 'C' }, line: 6 },
      { type: 'POP_CONTEXT' },

      { type: 'PHASE_EVENT_LOOP' },
      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 4️⃣ Promise vs setTimeout
  // --------------------------------------------------
  {
    id: 'promise-vs-timeout',
    name: '4. Promise vs setTimeout',
    description: 'Microtask priority over macrotask.',
    code: `setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("sync");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },

      { type: 'PHASE_EXECUTION' },
      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: 'timeout', delay: 0 },
        line: 0,
      },
      { type: 'SCHEDULE_MICROTASK', payload: { callback: 'promise' }, line: 4 },
      { type: 'LOG', payload: { value: 'sync' }, line: 8 },
      { type: 'POP_CONTEXT' },

      { type: 'PHASE_EVENT_LOOP' },
      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 5️⃣ async/await
  // --------------------------------------------------
  {
    id: 'async-await',
    name: '5. async/await',
    description: 'Await schedules continuation as microtask.',
    code: `async function test() {
  console.log("start");
  await Promise.resolve();
  console.log("after await");
}

test();
console.log("outside");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'test',
          body: [
            { type: 'LOG', payload: { value: 'start' }, line: 1 },
            {
              type: 'SCHEDULE_MICROTASK',
              payload: { callback: 'after await' },
              line: 2,
            },
            { type: 'RETURN' },
          ],
        },
        line: 0,
      },

      { type: 'PHASE_EXECUTION' },
      { type: 'CALL_FUNCTION', payload: { name: 'test' }, line: 6 },
      { type: 'LOG', payload: { value: 'outside' }, line: 7 },
      { type: 'POP_CONTEXT' },

      { type: 'PHASE_EVENT_LOOP' },
      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 6️⃣ Nested Microtasks
  // --------------------------------------------------
  {
    id: 'nested-microtasks',
    name: '6. Nested Microtasks',
    description: 'All microtasks flush before any macrotask.',
    code: `Promise.resolve().then(() => {
  console.log("first");
  
  Promise.resolve().then(() => {
    console.log("second");
  });
});

console.log("outside");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },

      { type: 'PHASE_EXECUTION' },
      {
        type: 'SCHEDULE_MICROTASK',
        payload: {
          callback: {
            log: 'first',
            scheduleMicrotask: 'second',
          },
        },
        line: 0,
      },
      { type: 'LOG', payload: { value: 'outside' }, line: 8 },
      { type: 'POP_CONTEXT' },

      { type: 'PHASE_EVENT_LOOP' },
      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 7️⃣ TDZ Error Demo
  // --------------------------------------------------
  {
    id: 'tdz-error',
    name: '7. TDZ Error Demo',
    description: 'Accessing let/const before initialization throws error.',
    code: `console.log(x);  // undefined (hoisted)
console.log(y);  // ReferenceError!

var x = 10;
let y = 20;`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      { type: 'DECLARE_VAR', payload: { name: 'x' }, line: 3 },
      { type: 'DECLARE_LET', payload: { name: 'y' }, line: 4 },

      { type: 'PHASE_EXECUTION' },
      { type: 'READ', payload: { name: 'x' }, line: 0 },
      { type: 'READ', payload: { name: 'y' }, line: 1 },
      { type: 'INITIALIZE', payload: { name: 'x', value: 10 }, line: 3 },
      { type: 'INITIALIZE', payload: { name: 'y', value: 20 }, line: 4 },
      { type: 'POP_CONTEXT' },
    ],
  },
];
