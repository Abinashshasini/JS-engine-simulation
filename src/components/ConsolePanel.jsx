import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ConsolePanel({ logs }) {
  const scrollRef = useRef(null);

  const consoleOutputs = (logs || [])
    .filter((log) => log.includes('console.log'))
    .map((log) => {
      const match = log.match(/console\.log\("([^"]+)"\)/);
      return match
        ? match[1]
        : log.replace(/.*console\.log.*?["']([^"']+)["'].*/, '$1');
    });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleOutputs.length]);

  return (
    <div className="flex flex-col flex-1 bg-vscode-panel border-r border-vscode-border min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <div className="flex items-center">
          <span className="mr-1.5">💻</span>
          Console
        </div>
        {consoleOutputs.length > 0 && (
          <span className="text-[9px] text-accent-green font-mono">
            {consoleOutputs.length} output
            {consoleOutputs.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto px-3 py-2 font-mono text-xs"
        ref={scrollRef}
      >
        {consoleOutputs.length === 0 ? (
          <div className="text-vscode-text-muted italic animate-float text-center py-4">
            <div className="text-lg mb-1">💻</div>
            No output yet
          </div>
        ) : (
          <AnimatePresence>
            {consoleOutputs.map((output, idx) => (
              <motion.div
                key={`out-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2 py-0.5 text-vscode-text"
              >
                <span className="text-accent-blue">›</span>
                <span className="animate-type-line">{output}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Errors */}
        <AnimatePresence>
          {(logs || [])
            .filter((log) => log.includes('Error') || log.includes('❌'))
            .map((error, idx) => (
              <motion.div
                key={`err-${idx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-2 py-0.5 text-accent-red"
              >
                <span>✗</span>
                <span>{error.replace(/❌\s*/, '')}</span>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
