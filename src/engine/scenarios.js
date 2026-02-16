export const scenarios = [
  // --------------------------------------------------
  // 1️⃣ Synchronous Execution
  // --------------------------------------------------

  {
    id: 'sync-basic',
    name: 'Synchronous Execution',
    description: 'Call stack + function hoisting.',
    code: `
function greet() {
  console.log("Hello")
}

console.log("Start")
greet()
console.log("End")
`,
    instructions: [
      // Creation phase
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'global' } },
      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'greet',
          body: [
            { type: 'LOG', payload: { value: 'Hello' } },
            { type: 'RETURN' },
          ],
        },
      },

      // Execution phase
      { type: 'LOG', payload: { value: 'Start' } },
      { type: 'CALL_FUNCTION', payload: { name: 'greet' } },
      { type: 'LOG', payload: { value: 'End' } },

      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 2️⃣ setTimeout(0)
  // --------------------------------------------------

  {
    id: 'timeout-basic',
    name: 'setTimeout(0)',
    description: 'Macrotask + var hoisting.',
    code: `
console.log("A")

setTimeout(() => {
  console.log("B")
}, 0)

console.log("C")
`,
    instructions: [
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'global' } },

      // no variables to hoist here

      { type: 'LOG', payload: { value: 'A' } },

      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: 'B' },
      },

      { type: 'LOG', payload: { value: 'C' } },

      { type: 'POP_CONTEXT' },

      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 3️⃣ Promise vs setTimeout
  // --------------------------------------------------

  {
    id: 'promise-vs-timeout',
    name: 'Promise vs setTimeout',
    description: 'Microtask priority.',
    code: `
setTimeout(() => console.log("timeout"))

Promise.resolve().then(() =>
  console.log("promise")
)

console.log("sync")
`,
    instructions: [
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'global' } },

      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: 'timeout' },
      },

      {
        type: 'SCHEDULE_MICROTASK',
        payload: { callback: 'promise' },
      },

      { type: 'LOG', payload: { value: 'sync' } },

      { type: 'POP_CONTEXT' },

      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 4️⃣ async / await
  // --------------------------------------------------

  {
    id: 'async-await',
    name: 'async / await',
    description: 'Await schedules microtask.',
    code: `
async function test() {
  console.log("start")
  await Promise.resolve()
  console.log("after await")
}

test()
console.log("outside")
`,
    instructions: [
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'global' } },

      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'test',
          body: [
            { type: 'LOG', payload: { value: 'start' } },
            {
              type: 'SCHEDULE_MICROTASK',
              payload: { callback: 'after await' },
            },
            { type: 'RETURN' },
          ],
        },
      },

      { type: 'CALL_FUNCTION', payload: { name: 'test' } },

      { type: 'LOG', payload: { value: 'outside' } },

      { type: 'POP_CONTEXT' },

      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 5️⃣ Nested Microtasks
  // --------------------------------------------------

  {
    id: 'nested-microtasks',
    name: 'Nested Microtasks',
    description: 'Microtasks flush fully.',
    code: `
Promise.resolve().then(() => {
  console.log("first")

  Promise.resolve().then(() => {
    console.log("second")
  })
})

console.log("outside")
`,
    instructions: [
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'global' } },

      {
        type: 'SCHEDULE_MICROTASK',
        payload: {
          callback: {
            log: 'first',
            scheduleMicrotask: 'second',
          },
        },
      },

      { type: 'LOG', payload: { value: 'outside' } },

      { type: 'POP_CONTEXT' },

      { type: 'EVENT_LOOP_TICK' },
    ],
  },
];
