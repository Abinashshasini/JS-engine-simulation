import { motion, AnimatePresence } from 'framer-motion';
import { concepts } from '../engine/concepts';

export function StepExplanation({ explanation }) {
  if (!explanation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl mb-4"
        >
          🎯
        </motion.div>
        <h3 className="text-vscode-text font-medium text-sm mb-2">
          Ready to Learn
        </h3>
        <p className="text-vscode-comment text-xs leading-relaxed mb-6">
          Press <span className="text-accent-blue font-medium">Step</span> or{' '}
          <span className="text-accent-blue font-medium">Space</span> to advance
          through the code execution and see detailed explanations here.
        </p>
        <div className="space-y-2 text-[10px] text-vscode-text-muted">
          {[
            { key: 'Space / →', label: 'Step' },
            { key: 'P', label: 'Play/Pause' },
            { key: 'R', label: 'Reset' },
            { key: '↑/↓', label: 'Change scenario' },
          ].map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <kbd className="px-1.5 py-0.5 bg-vscode-input border border-vscode-border rounded text-[9px] font-mono min-w-[52px] text-center">
                {item.key}
              </kbd>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={explanation.title}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="h-full flex flex-col"
      >
        {/* Title */}
        <div className="mb-4">
          <motion.h3
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="text-accent-yellow font-semibold text-base mb-1.5"
          >
            {explanation.title}
          </motion.h3>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="h-0.5 bg-accent-blue rounded"
          />
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <h4 className="text-vscode-text-secondary text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent-blue" />
            What&apos;s happening
          </h4>
          <p className="text-vscode-text text-sm leading-relaxed">
            {explanation.description}
          </p>
        </motion.div>

        {/* Concept Box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-vscode-bg rounded-lg p-3 border border-vscode-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="text-lg"
            >
              💡
            </motion.span>
            <span className="text-accent-blue text-xs font-semibold uppercase tracking-wider">
              Key Concept
            </span>
          </div>
          {(() => {
            const key = explanation.concept;
            const info = key ? concepts[key] : null;
            if (info) {
              return (
                <div>
                  <div className="text-vscode-text font-medium text-sm mb-1">
                    {info.title}
                  </div>
                  <p className="text-vscode-text text-sm leading-relaxed mb-2">
                    {info.definition}
                  </p>
                  {info.example && (
                    <pre className="bg-vscode-panel p-2 rounded text-[11px] overflow-auto border border-vscode-border">
                      {info.example}
                    </pre>
                  )}
                </div>
              );
            }

            return (
              <p className="text-vscode-text text-sm leading-relaxed">
                {explanation.concept}
              </p>
            );
          })()}
        </motion.div>

        {/* Additional Tips based on instruction type */}
        <AnimatePresence>
          {explanation.concept === 'hoisting' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg overflow-hidden"
            >
              <div className="text-accent-yellow text-xs font-medium mb-1">
                ⚠️ Common Pitfall
              </div>
              <p className="text-vscode-text text-xs">
                Only declarations are hoisted, not initializations. Using a
                variable before its declaration with{' '}
                <code className="text-accent-purple">let</code>/
                <code className="text-accent-purple">const</code> causes a
                ReferenceError (TDZ).
              </p>
            </motion.div>
          )}

          {explanation.concept === 'microtask' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg overflow-hidden"
            >
              <div className="text-accent-purple text-xs font-medium mb-1">
                📚 Remember
              </div>
              <p className="text-vscode-text text-xs">
                Microtasks (Promises, queueMicrotask) always run before
                macrotasks (setTimeout, setInterval) in the event loop.
              </p>
            </motion.div>
          )}

          {explanation.concept === 'macrotask' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg overflow-hidden"
            >
              <div className="text-accent-green text-xs font-medium mb-1">
                🔄 Event Loop Order
              </div>
              <p className="text-vscode-text text-xs">
                After each macrotask, ALL microtasks are processed before the
                next macrotask begins.
              </p>
            </motion.div>
          )}

          {explanation.concept === 'garbage-collection' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg overflow-hidden"
            >
              <div className="text-accent-cyan text-xs font-medium mb-1">
                🗑️ Memory Management
              </div>
              <p className="text-vscode-text text-xs mb-2">
                When a function returns or block scope exits, variables not
                referenced by closures become eligible for garbage collection.
                The JS engine automatically frees this memory.
              </p>
              <p className="text-vscode-text text-xs">
                💡 Closures keep outer variables alive! This is useful for data
                encapsulation but can lead to memory leaks if not managed
                carefully.
              </p>
            </motion.div>
          )}

          {explanation.concept === 'closure' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-cyan-900/20 border border-cyan-700/30 rounded-lg overflow-hidden"
            >
              <div className="text-accent-cyan text-xs font-medium mb-1">
                🔗 Closure & Memory
              </div>
              <p className="text-vscode-text text-xs">
                Closures prevent garbage collection of captured variables. Make
                sure to clean up event listeners and timers to avoid memory
                leaks.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
