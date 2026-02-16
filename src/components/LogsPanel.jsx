import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LogsPanel({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs?.length]);

  const getLogColor = (log) => {
    if (log.includes('PHASE') || log.includes('━━━'))
      return 'text-accent-cyan font-medium';
    if (log.includes('Context')) return 'text-accent-blue';
    if (log.includes('memory') || log.includes('📝')) return 'text-accent-cyan';
    if (log.includes('console.log') || log.includes('📢'))
      return 'text-accent-orange';
    if (log.includes('Error') || log.includes('❌') || log.includes('TDZ'))
      return 'text-accent-red';
    if (
      log.includes('Function') ||
      log.includes('function') ||
      log.includes('📞')
    )
      return 'text-accent-yellow';
    return 'text-vscode-text';
  };

  const getLogIcon = (log) => {
    if (log.includes('PHASE')) return '🔷';
    if (log.includes('Context')) return '📂';
    if (log.includes('Error') || log.includes('❌')) return '🔴';
    if (log.includes('console.log') || log.includes('📢')) return '🟢';
    if (log.includes('Function') || log.includes('📞')) return '🟡';
    return null;
  };

  return (
    <div className="flex flex-col flex-1 bg-vscode-panel min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <div className="flex items-center">
          <span className="mr-1.5">📋</span>
          Log
        </div>
        {logs && logs.length > 0 && (
          <span className="text-[9px] text-vscode-text-muted font-mono">
            {logs.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto px-3 py-2 text-[11px]"
        ref={scrollRef}
      >
        {!logs || logs.length === 0 ? (
          <div className="text-vscode-text-muted italic text-center py-4 animate-float">
            <div className="text-lg mb-1">📋</div>
            Click "▶" to start
          </div>
        ) : (
          <AnimatePresence>
            {logs.map((log, idx) => {
              const icon = getLogIcon(log);
              const isLatest = idx === logs.length - 1;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-start gap-2 py-1 border-b border-vscode-border last:border-b-0 ${
                    isLatest ? 'bg-accent-blue/5' : ''
                  }`}
                >
                  <span className="text-vscode-text-muted min-w-6 text-right tabular-nums">
                    {idx + 1}
                  </span>
                  {icon && <span className="text-[10px]">{icon}</span>}
                  <span className={getLogColor(log)}>{log}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
