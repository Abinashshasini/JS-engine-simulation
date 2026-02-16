import { motion, AnimatePresence } from 'framer-motion';
import { concepts } from '../engine/concepts';

export function StepExplanation({ explanation }) {
  if (!explanation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-4">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-vscode-text font-medium text-sm mb-2">
          Ready to Learn
        </h3>
        <p className="text-vscode-comment text-xs leading-relaxed">
          Press <span className="text-accent-blue font-medium">Step</span> or{' '}
          <span className="text-accent-blue font-medium">Space</span> to advance
          through the code execution and see detailed explanations here.
        </p>
        <div className="mt-4 text-[10px] text-vscode-text-muted space-y-1">
          <div>⌨️ Space / → = Step</div>
          <div>⌨️ P = Play/Pause</div>
          <div>⌨️ R = Reset</div>
          <div>⌨️ ↑/↓ = Change scenario</div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={explanation.title}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="h-full flex flex-col"
      >
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-accent-yellow font-semibold text-base mb-1">
            {explanation.title}
          </h3>
          <div className="h-0.5 w-12 bg-accent-blue rounded" />
        </div>

        {/* Description */}
        <div className="mb-4">
          <h4 className="text-vscode-text-secondary text-[10px] uppercase tracking-wider mb-2">
            What&apos;s happening
          </h4>
          <p className="text-vscode-text text-sm leading-relaxed">
            {explanation.description}
          </p>
        </div>

        {/* Concept Box */}
        <div className="bg-vscode-bg rounded-lg p-3 border border-vscode-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
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
                    <pre className="bg-vscode-panel p-2 rounded text-[11px] overflow-auto">
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
        </div>

        {/* Additional Tips based on instruction type */}
        {explanation.concept === 'hoisting' && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <div className="text-accent-yellow text-xs font-medium mb-1">
              ⚠️ Common Pitfall
            </div>
            <p className="text-vscode-text text-xs">
              Only declarations are hoisted, not initializations. Using a
              variable before its declaration with <code>let</code>/
              <code>const</code> causes a ReferenceError (TDZ).
            </p>
          </div>
        )}

        {explanation.concept === 'microtask' && (
          <div className="mt-4 p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
            <div className="text-accent-purple text-xs font-medium mb-1">
              📚 Remember
            </div>
            <p className="text-vscode-text text-xs">
              Microtasks (Promises, queueMicrotask) always run before macrotasks
              (setTimeout, setInterval) in the event loop.
            </p>
          </div>
        )}

        {explanation.concept === 'macrotask' && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
            <div className="text-accent-green text-xs font-medium mb-1">
              🔄 Event Loop Order
            </div>
            <p className="text-vscode-text text-xs">
              After each macrotask, ALL microtasks are processed before the next
              macrotask begins.
            </p>
          </div>
        )}

        {explanation.concept === 'garbage-collection' && (
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <div className="text-accent-cyan text-xs font-medium mb-1">
              🗑️ Memory Management
            </div>
            <p className="text-vscode-text text-xs mb-2">
              When a function returns or block scope exits, variables not
              referenced by closures become eligible for garbage collection. The
              JS engine automatically frees this memory.
            </p>
            <p className="text-vscode-text text-xs">
              💡 Closures keep outer variables alive! This is useful for data
              encapsulation but can lead to memory leaks if not managed
              carefully.
            </p>
          </div>
        )}

        {explanation.concept === 'closure' && (
          <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-700/30 rounded-lg">
            <div className="text-accent-cyan text-xs font-medium mb-1">
              🔗 Closure & Memory
            </div>
            <p className="text-vscode-text text-xs">
              Closures prevent garbage collection of captured variables. Make
              sure to clean up event listeners and timers to avoid memory leaks.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
