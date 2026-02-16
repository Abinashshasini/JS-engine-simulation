export const concepts = {
  hoisting: {
    title: 'Hoisting',
    definition:
      "Hoisting is JavaScript's behavior of moving declarations to the top of their scope during the creation phase. Function declarations are hoisted with their body; var declarations are hoisted and initialized to undefined. let/const are hoisted but not initialized (TDZ).",
    details:
      'During the creation phase, the engine records variable and function names in the environment record. This is why you can call a function declared with `function` before its declaration in code, but accessing `let`/`const` before initialization throws a ReferenceError.',
    example: `// Function hoisting
greet();
function greet(){ console.log('hi'); }

// var hoisting
console.log(x); // undefined
var x = 5;

// let/const - TDZ
console.log(y); // ReferenceError
let y = 2;`,
  },

  tdz: {
    title: 'Temporal Dead Zone (TDZ)',
    definition:
      'TDZ is the period between entering scope and when a `let` or `const` variable is initialized. Accessing the variable during TDZ causes a ReferenceError.',
    details:
      'Though `let` and `const` are hoisted, they remain uninitialized until their declaration is evaluated. This prevents some common bugs related to accidental early access.',
  },

  'execution-context': {
    title: 'Execution Context',
    definition:
      'An execution context is an abstract concept that holds information about the environment in which code is evaluated: variable environment, lexical environment, and `this` binding.',
    details:
      'There is a global execution context, and each function invocation creates a new function execution context. The call stack keeps track of active contexts.',
  },

  closure: {
    title: 'Closure',
    definition:
      'A closure is a function that captures variables from its surrounding lexical environment, allowing the function to access those variables even after the outer function has returned.',
    details:
      'Closures are created whenever a function is defined in another function. They are commonly used for data privacy and factory functions.',
    example: `function outer(){ let count=0; return function(){ return ++count } }`,
  },

  'event-loop': {
    title: 'Event Loop',
    definition:
      'The event loop coordinates the execution of code, handling callbacks, and managing microtask and macrotask queues. Microtasks run before macrotasks.',
    details:
      'The browser runtime executes the current stack, then flushes microtasks (Promises), then runs one macrotask (setTimeout, I/O), and repeats. This ordering explains why Promises often run before setTimeout callbacks even when both are scheduled.',
  },

  microtask: {
    title: 'Microtasks',
    definition:
      'Microtasks are short callbacks queued by Promises (then/catch/finally) and queueMicrotask. They run immediately after the current task completes, before the next macrotask.',
    details:
      'Because microtasks run before macrotasks, scheduling work with Promises can change ordering and timing compared to setTimeout.',
  },

  macrotask: {
    title: 'Macrotasks',
    definition:
      'Macrotasks (also called tasks) include setTimeout, setInterval, and many browser events. The event loop processes one macrotask at a time, between microtask flushes.',
    details:
      'Macrotasks are suitable for scheduling longer-running work or breaking up expensive computations across ticks.',
  },

  'garbage-collection': {
    title: 'Garbage Collection',
    definition:
      'Garbage collection (GC) is an automatic memory management process where the JavaScript engine identifies and removes objects that are no longer reachable or needed by the program.',
    details:
      'Modern JavaScript engines use mark-and-sweep algorithms. When a function returns or a block scope exits, variables that are not referenced by closures or outer scopes become eligible for garbage collection. The GC runs periodically to free up memory.',
    example: `function create() {
  let temp = { data: 'large object' };
  // temp is eligible for GC after return
  return; 
}

function withClosure() {
  let kept = { data: 'preserved' };
  // kept is NOT eligible for GC
  // because the closure keeps it alive
  return () => console.log(kept);
}`,
  },

  'memory-leak': {
    title: 'Memory Leaks',
    definition:
      'A memory leak occurs when objects remain in memory even though they are no longer needed, typically because references are unintentionally kept alive.',
    details:
      'Common causes: forgotten timers, event listeners not removed, closures holding references longer than needed, or global variables accumulating data.',
    example: `// Memory leak example
let leaks = [];
setInterval(() => {
  leaks.push(new Array(1000)); // Never cleared!
}, 100);

// Fixed version
let data = [];
const id = setInterval(() => {
  data.push(new Array(1000));
}, 100);
clearInterval(id); // Clean up when done`,
  },
};
