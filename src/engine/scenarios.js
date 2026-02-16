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

  // --------------------------------------------------
  // 8️⃣ Block Scope
  // --------------------------------------------------
  {
    id: 'block-scope',
    name: '8. Block Scope',
    description: 'let/const are block-scoped, var is function-scoped.',
    code: `var a = 1;
let b = 2;

{
  var a = 10;  // same var
  let b = 20;  // new b
  console.log(a, b);
}

console.log(a, b);`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      { type: 'DECLARE_VAR', payload: { name: 'a' }, line: 0 },
      { type: 'DECLARE_LET', payload: { name: 'b' }, line: 1 },

      { type: 'PHASE_EXECUTION' },
      { type: 'INITIALIZE', payload: { name: 'a', value: 1 }, line: 0 },
      { type: 'INITIALIZE', payload: { name: 'b', value: 2 }, line: 1 },

      { type: 'ENTER_BLOCK', line: 3 },
      { type: 'DECLARE_LET', payload: { name: 'b' }, line: 5 },
      { type: 'ASSIGN', payload: { name: 'a', value: 10 }, line: 4 },
      { type: 'INITIALIZE', payload: { name: 'b', value: 20 }, line: 5 },
      { type: 'LOG', payload: { value: '10, 20' }, line: 6 },
      { type: 'EXIT_BLOCK', line: 7 },

      { type: 'LOG', payload: { value: '10, 2' }, line: 9 },
      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 9️⃣ Closure
  // --------------------------------------------------
  {
    id: 'closure',
    name: '9. Closure',
    description: 'Inner function captures outer variables via scope chain.',
    code: `function outer() {
  let count = 0;
  
  function inner() {
    count++;
    console.log(count);
  }
  
  return inner;
}

const counter = outer();
counter();
counter();`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'outer',
          body: [
            { type: 'PHASE_CREATION' },
            { type: 'DECLARE_LET', payload: { name: 'count' }, line: 1 },
            {
              type: 'DECLARE_FUNCTION',
              payload: {
                name: 'inner',
                body: [
                  {
                    type: 'ASSIGN',
                    payload: { name: 'count', value: '++' },
                    line: 4,
                  },
                  { type: 'LOG', payload: { value: 'count' }, line: 5 },
                  { type: 'RETURN' },
                ],
              },
              line: 3,
            },
            { type: 'PHASE_EXECUTION' },
            {
              type: 'INITIALIZE',
              payload: { name: 'count', value: 0 },
              line: 1,
            },
            { type: 'RETURN' },
          ],
        },
        line: 0,
      },
      { type: 'DECLARE_CONST', payload: { name: 'counter' }, line: 11 },

      { type: 'PHASE_EXECUTION' },
      { type: 'CALL_FUNCTION', payload: { name: 'outer' }, line: 11 },
      { type: 'LOG', payload: { value: '1' }, line: 12 },
      { type: 'LOG', payload: { value: '2' }, line: 13 },
      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 🔟 Multiple Event Loop Cycles
  // --------------------------------------------------
  {
    id: 'multiple-timers',
    name: '10. Multiple Timers',
    description: 'Multiple macrotasks with event loop cycles.',
    code: `console.log("start");

setTimeout(() => console.log("timer1"), 0);
setTimeout(() => console.log("timer2"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("end");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },

      { type: 'PHASE_EXECUTION' },
      { type: 'LOG', payload: { value: 'start' }, line: 0 },
      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: 'timer1', delay: 0 },
        line: 2,
      },
      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: 'timer2', delay: 0 },
        line: 3,
      },
      { type: 'SCHEDULE_MICROTASK', payload: { callback: 'promise' }, line: 5 },
      { type: 'LOG', payload: { value: 'end' }, line: 7 },
      { type: 'POP_CONTEXT' },

      { type: 'PHASE_EVENT_LOOP' },
      { type: 'EVENT_LOOP_TICK' },
      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 1️⃣1️⃣ Promise.all
  // --------------------------------------------------
  {
    id: 'promise-all',
    name: '11. Promise.all',
    description: 'Promise.all waits for all promises and resolves together.',
    code: `const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(values => {
    console.log(values);
  });

console.log("after Promise.all");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      { type: 'DECLARE_CONST', payload: { name: 'p1' }, line: 0 },
      { type: 'DECLARE_CONST', payload: { name: 'p2' }, line: 1 },
      { type: 'DECLARE_CONST', payload: { name: 'p3' }, line: 2 },

      { type: 'PHASE_EXECUTION' },
      {
        type: 'INITIALIZE',
        payload: { name: 'p1', value: 'Promise<1>' },
        line: 0,
      },
      {
        type: 'INITIALIZE',
        payload: { name: 'p2', value: 'Promise<2>' },
        line: 1,
      },
      {
        type: 'INITIALIZE',
        payload: { name: 'p3', value: 'Promise<3>' },
        line: 2,
      },
      {
        type: 'SCHEDULE_MICROTASK',
        payload: { callback: '[1, 2, 3]' },
        line: 4,
      },
      { type: 'LOG', payload: { value: 'after Promise.all' }, line: 9 },
      { type: 'POP_CONTEXT' },

      { type: 'PHASE_EVENT_LOOP' },
      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 1️⃣2️⃣ Try-Catch Error Handling
  // --------------------------------------------------
  {
    id: 'try-catch',
    name: '12. Try-Catch',
    description: 'Error handling with try-catch blocks.',
    code: `console.log("start");

try {
  throw new Error("oops!");
  console.log("never runs");
} catch (e) {
  console.log("caught:", e.message);
} finally {
  console.log("finally runs");
}

console.log("end");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },

      { type: 'PHASE_EXECUTION' },
      { type: 'LOG', payload: { value: 'start' }, line: 0 },
      { type: 'ENTER_BLOCK', line: 2 },
      { type: 'THROW_ERROR', payload: { message: 'oops!' }, line: 3 },
      { type: 'ENTER_BLOCK', line: 5 },
      { type: 'DECLARE_LET', payload: { name: 'e' }, line: 5 },
      {
        type: 'INITIALIZE',
        payload: { name: 'e', value: 'Error: oops!' },
        line: 5,
      },
      { type: 'LOG', payload: { value: 'caught: oops!' }, line: 6 },
      { type: 'EXIT_BLOCK', line: 7 },
      { type: 'ENTER_BLOCK', line: 7 },
      { type: 'LOG', payload: { value: 'finally runs' }, line: 8 },
      { type: 'EXIT_BLOCK', line: 9 },
      { type: 'LOG', payload: { value: 'end' }, line: 11 },
      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 1️⃣3️⃣ this Binding
  // --------------------------------------------------
  {
    id: 'this-binding',
    name: '13. this Binding',
    description: 'How "this" keyword is bound in different contexts.',
    code: `const obj = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
  greetArrow: () => {
    console.log(this.name);
  }
};

obj.greet();
obj.greetArrow();`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      { type: 'DECLARE_CONST', payload: { name: 'obj' }, line: 0 },

      { type: 'PHASE_EXECUTION' },
      {
        type: 'INITIALIZE',
        payload: {
          name: 'obj',
          value: '{ name, greet, greetArrow }',
        },
        line: 0,
      },
      {
        type: 'CALL_FUNCTION',
        payload: { name: 'obj.greet', this: 'obj' },
        line: 10,
      },
      { type: 'LOG', payload: { value: 'Alice' }, line: 3 },
      { type: 'POP_CONTEXT' },
      {
        type: 'CALL_FUNCTION',
        payload: { name: 'obj.greetArrow', this: 'global' },
        line: 11,
      },
      { type: 'LOG', payload: { value: 'undefined' }, line: 6 },
      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 1️⃣4️⃣ Event Loop Order Challenge
  // --------------------------------------------------
  {
    id: 'event-loop-challenge',
    name: '14. Event Loop Challenge',
    description: 'Complex ordering: sync, microtask, macrotask.',
    code: `console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => console.log("3"));
}, 0);

Promise.resolve().then(() => {
  console.log("4");
  setTimeout(() => console.log("5"), 0);
});

console.log("6");`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },

      { type: 'PHASE_EXECUTION' },
      { type: 'LOG', payload: { value: '1' }, line: 0 },
      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: '2 + microtask(3)', delay: 0 },
        line: 2,
      },
      {
        type: 'SCHEDULE_MICROTASK',
        payload: { callback: '4 + macrotask(5)' },
        line: 7,
      },
      { type: 'LOG', payload: { value: '6' }, line: 12 },
      { type: 'POP_CONTEXT' },

      { type: 'PHASE_EVENT_LOOP' },
      // First: flush microtasks (logs "4", schedules timeout for "5")
      { type: 'LOG', payload: { value: '4' }, line: 8 },
      {
        type: 'REGISTER_TIMEOUT',
        payload: { callback: '5', delay: 0 },
        line: 9,
      },
      // Then: macrotask "2", which schedules microtask "3"
      { type: 'EVENT_LOOP_TICK' },
      { type: 'LOG', payload: { value: '2' }, line: 3 },
      { type: 'SCHEDULE_MICROTASK', payload: { callback: '3' }, line: 4 },
      { type: 'EVENT_LOOP_TICK' },
      // Final macrotask "5"
      { type: 'EVENT_LOOP_TICK' },
    ],
  },

  // --------------------------------------------------
  // 1️⃣5️⃣ Recursion & Stack Overflow
  // --------------------------------------------------
  {
    id: 'recursion',
    name: '15. Recursion',
    description: 'Call stack grows with each recursive call.',
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const result = factorial(3);
console.log(result);`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      {
        type: 'DECLARE_FUNCTION',
        payload: { name: 'factorial', body: [] },
        line: 0,
      },
      { type: 'DECLARE_CONST', payload: { name: 'result' }, line: 5 },

      { type: 'PHASE_EXECUTION' },
      { type: 'CALL_FUNCTION', payload: { name: 'factorial(3)' }, line: 5 },
      { type: 'CALL_FUNCTION', payload: { name: 'factorial(2)' }, line: 2 },
      { type: 'CALL_FUNCTION', payload: { name: 'factorial(1)' }, line: 2 },
      { type: 'RETURN', payload: { value: 1 } },
      { type: 'RETURN', payload: { value: 2 } },
      { type: 'RETURN', payload: { value: 6 } },
      { type: 'INITIALIZE', payload: { name: 'result', value: 6 }, line: 5 },
      { type: 'LOG', payload: { value: '6' }, line: 6 },
      { type: 'POP_CONTEXT' },
    ],
  },

  // --------------------------------------------------
  // 1️⃣6️⃣ Garbage Collection & Memory Management
  // --------------------------------------------------
  {
    id: 'garbage-collection',
    name: '16. Garbage Collection',
    description:
      'Variables become GC-eligible when out of scope, unless captured by closures.',
    code: `function temp() {
  let unused = { size: 1000 };
  console.log("temp runs");
}

function makeClosure() {
  let kept = { preserved: true };
  return () => kept;
}

temp();
const fn = makeClosure();`,
    instructions: [
      { type: 'PHASE_CREATION' },
      { type: 'PUSH_CONTEXT', payload: { type: 'global', name: 'Global' } },
      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'temp',
          body: [
            { type: 'PHASE_CREATION' },
            { type: 'DECLARE_LET', payload: { name: 'unused' }, line: 1 },
            { type: 'PHASE_EXECUTION' },
            {
              type: 'INITIALIZE',
              payload: { name: 'unused', value: '{ size: 1000 }' },
              line: 1,
            },
            { type: 'LOG', payload: { value: 'temp runs' }, line: 2 },
            { type: 'RETURN' },
          ],
        },
        line: 0,
      },
      {
        type: 'DECLARE_FUNCTION',
        payload: {
          name: 'makeClosure',
          body: [
            { type: 'PHASE_CREATION' },
            { type: 'DECLARE_LET', payload: { name: 'kept' }, line: 6 },
            { type: 'PHASE_EXECUTION' },
            {
              type: 'INITIALIZE',
              payload: { name: 'kept', value: '{ preserved: true }' },
              line: 6,
            },
            { type: 'RETURN' },
          ],
        },
        line: 5,
      },
      { type: 'DECLARE_CONST', payload: { name: 'fn' }, line: 11 },

      { type: 'PHASE_EXECUTION' },
      { type: 'CALL_FUNCTION', payload: { name: 'temp' }, line: 10 },
      { type: 'LOG', payload: { value: 'temp runs' }, line: 2 },
      { type: 'POP_CONTEXT' },
      { type: 'CALL_FUNCTION', payload: { name: 'makeClosure' }, line: 11 },
      {
        type: 'INITIALIZE',
        payload: { name: 'fn', value: '<closure>' },
        line: 11,
      },
      { type: 'POP_CONTEXT' },
    ],
  },
];
