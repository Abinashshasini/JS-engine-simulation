import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Animated typing code block
function TypedCode() {
  const code = `console.log("start");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");`;

  const [displayed, setDisplayed] = useState('');
  const [lineHighlight, setLineHighlight] = useState(-1);
  const idx = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (idx.current <= code.length) {
        setDisplayed(code.slice(0, idx.current));
        const lines = code.slice(0, idx.current).split('\n');
        setLineHighlight(lines.length - 1);
        idx.current++;
      } else {
        // Reset after pause
        setTimeout(() => {
          idx.current = 0;
          setDisplayed('');
          setLineHighlight(-1);
        }, 2000);
      }
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const lines = displayed.split('\n');

  return (
    <div className="bg-vscode-bg border border-vscode-border rounded-lg overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-vscode-panel border-b border-vscode-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent-red/80" />
          <div className="w-3 h-3 rounded-full bg-accent-yellow/80" />
          <div className="w-3 h-3 rounded-full bg-accent-green/80" />
        </div>
        <span className="text-[11px] text-vscode-text-muted ml-2">demo.js</span>
      </div>
      {/* Code */}
      <div className="p-4 font-mono text-[13px] leading-6 min-h-70">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`flex transition-colors duration-150 ${i === lineHighlight ? 'bg-accent-blue/15' : ''}`}
          >
            <span className="w-6 text-right pr-3 select-none text-vscode-text-muted text-[11px]">
              {i + 1}
            </span>
            <span className="text-vscode-text whitespace-pre">{line}</span>
            {i === lineHighlight && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="inline-block w-0.5 h-4 bg-accent-blue ml-0.5 mt-1"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated console output preview
function ConsolePreview() {
  const outputs = [
    { text: '> start', color: 'text-accent-green', delay: 3 },
    { text: '> end', color: 'text-accent-green', delay: 5 },
    { text: '> promise', color: 'text-accent-cyan', delay: 7.5 },
    { text: '> timeout', color: 'text-accent-orange', delay: 9.5 },
  ];

  return (
    <div className="bg-vscode-bg border border-vscode-border rounded-lg overflow-hidden mt-4">
      <div className="px-4 py-2 bg-vscode-panel border-b border-vscode-border text-[11px] text-vscode-text-muted uppercase tracking-wide">
        Console Output
      </div>
      <div className="p-4 font-mono text-sm min-h-[120px] space-y-1">
        {outputs.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay, duration: 0.3 }}
            className={item.color}
          >
            {item.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Animated event loop diagram
function EventLoopMini() {
  const items = [
    {
      label: 'Call Stack',
      color: 'bg-accent-blue/20 border-accent-blue/40',
      icon: '📚',
    },
    {
      label: 'Microtask',
      color: 'bg-accent-purple/20 border-accent-purple/40',
      icon: '⚡',
    },
    {
      label: 'Macrotask',
      color: 'bg-accent-orange/20 border-accent-orange/40',
      icon: '⏰',
    },
    {
      label: 'Web APIs',
      color: 'bg-accent-green/20 border-accent-green/40',
      icon: '🌐',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 + i * 0.15, type: 'spring', stiffness: 200 }}
          className={`${item.color} border rounded-lg p-3 text-center`}
        >
          <div className="text-xl mb-1">{item.icon}</div>
          <div className="text-[11px] text-vscode-text font-medium">
            {item.label}
          </div>
        </motion.div>
      ))}
      {/* Animated arrow loop */}
      <motion.div
        className="col-span-2 flex justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <span className="text-accent-blue text-lg">🔄</span>
      </motion.div>
    </div>
  );
}

// Stagger container
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function LandingPage({ onStart }) {
  /** Function to show js engine on click enter */
  const handleEnterClick = (e) => {
    if (e.key === 'Enter') {
      onStart();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnterClick);
    return () => window.removeEventListener('keydown', handleEnterClick);
  }, []);

  return (
    <div
      className="h-screen w-screen bg-vscode-darker text-vscode-text overflow-auto relative"
      tabIndex={0}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-16">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs font-medium mb-4"
            >
              Interactive Learning Tool
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              See How
              <br />
              <span className="bg-linear-to-r from-accent-blue via-accent-cyan to-accent-purple bg-clip-text text-transparent">
                JavaScript
              </span>
              <br />
              Really Works
            </h1>

            <p className="text-lg text-vscode-text-secondary max-w-lg mb-8 leading-relaxed">
              Visualize execution contexts, memory hoisting, the event loop,
              closures, garbage collection, and more — one step at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStart}
                className="px-8 py-3.5 bg-accent-blue text-white rounded-lg text-lg font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-accent-blue/25 inline-flex items-center gap-3"
              >
                Start Visualizing
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </motion.button>
              <span className="text-vscode-text-muted text-sm">
                or press{' '}
                <kbd className="px-2 py-0.5 bg-vscode-input border border-vscode-border rounded text-xs font-mono">
                  Enter
                </kbd>
              </span>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              {[
                { num: '16+', label: 'Scenarios' },
                { num: '7', label: 'Core Concepts' },
                { num: '100%', label: 'Visual' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-accent-cyan">
                    {stat.num}
                  </div>
                  <div className="text-xs text-vscode-text-muted">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — live code demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full max-w-xl"
          >
            <TypedCode />
            <ConsolePreview />
          </motion.div>
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Pick a Scenario',
                desc: 'Choose from 16+ code examples covering JS fundamentals',
                icon: '📋',
              },
              {
                step: '02',
                title: 'Step Through Code',
                desc: 'Watch the engine execute each line and allocate memory',
                icon: '▶️',
              },
              {
                step: '03',
                title: 'Watch the Event Loop',
                desc: 'See microtasks, macrotasks, and Web APIs in action',
                icon: '🔄',
              },
              {
                step: '04',
                title: 'Read Explanations',
                desc: 'Get detailed descriptions for every concept and step',
                icon: '💡',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative bg-vscode-panel border border-vscode-border rounded-xl p-6 group hover:border-accent-blue/50 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-accent-blue text-xs font-mono mb-2 opacity-50">
                  {item.step}
                </div>
                <h3 className="font-semibold text-vscode-text mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-vscode-text-secondary leading-relaxed">
                  {item.desc}
                </p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-vscode-text-muted">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features + Event Loop diagram */}
        <div className="flex flex-col lg:flex-row gap-10 mb-20">
          {/* Features */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex-1 grid sm:grid-cols-2 gap-4"
          >
            {[
              {
                icon: '📦',
                title: 'Memory Allocation',
                desc: 'See var/let/const hoisting and TDZ in real time',
              },
              {
                icon: '🔄',
                title: 'Event Loop',
                desc: 'Microtask vs macrotask priority visualized',
              },
              {
                icon: '🗑️',
                title: 'Garbage Collection',
                desc: 'Learn when objects become GC-eligible',
              },
              {
                icon: '🔗',
                title: 'Closures & Scope',
                desc: 'Watch scope chains and closure captures',
              },
              {
                icon: '🎨',
                title: 'Syntax Highlighting',
                desc: 'VS Code-style coloring for all code',
              },
              {
                icon: '📖',
                title: 'Rich Explanations',
                desc: 'Concept definitions, examples, and tips',
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="bg-vscode-panel border border-vscode-border rounded-lg p-5 hover:border-accent-blue/40 transition-colors group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm text-vscode-text mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-vscode-text-secondary leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Mini event loop diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-64 flex flex-col items-center justify-center"
          >
            <h3 className="text-sm font-semibold text-vscode-text-secondary mb-4 uppercase tracking-wider">
              Event Loop
            </h3>
            <EventLoopMini />
          </motion.div>
        </div>

        {/* Topics covered */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-vscode-panel border border-vscode-border rounded-xl p-8 mb-16"
        >
          <h2 className="text-xl font-semibold text-accent-yellow mb-6 text-center">
            Topics Covered
          </h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              'Hoisting',
              'TDZ',
              'var / let / const',
              'Execution Context',
              'Call Stack',
              'Closures',
              'Scope Chain',
              'Event Loop',
              'Microtasks',
              'Macrotasks',
              'Promises',
              'async/await',
              'setTimeout',
              'Recursion',
              'Garbage Collection',
              'Memory Leaks',
              'try-catch',
              'this Binding',
              'Block Scope',
              'Web APIs',
            ].map((topic) => (
              <motion.span
                key={topic}
                variants={fadeUp}
                whileHover={{ scale: 1.08, y: -2 }}
                className="px-4 py-2 bg-vscode-bg text-vscode-text text-xs rounded-full border border-vscode-border hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-colors cursor-default"
              >
                {topic}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Keyboard shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-vscode-bg border border-vscode-border rounded-xl p-6 mb-12"
        >
          <h3 className="text-lg font-semibold text-vscode-text mb-4 text-center">
            ⌨️ Keyboard Shortcuts
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { keys: 'Space / →', action: 'Next Step' },
              { keys: 'P', action: 'Play / Pause' },
              { keys: 'R', action: 'Reset Scenario' },
              { keys: '↑ / ↓', action: 'Switch Scenario' },
            ].map((s) => (
              <div
                key={s.keys}
                className="flex items-center gap-3 justify-center"
              >
                <kbd className="px-3 py-1.5 bg-vscode-panel border border-vscode-border rounded-md text-xs font-mono text-accent-cyan min-w-[80px] text-center">
                  {s.keys}
                </kbd>
                <span className="text-xs text-vscode-text-secondary">
                  {s.action}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="px-10 py-4 bg-accent-blue text-white rounded-xl text-lg font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-accent-blue/25"
          >
            Start Visualizing →
          </motion.button>
          <p className="mt-4 text-vscode-text-muted text-sm">
            No sign-up. No install. Just learn.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
