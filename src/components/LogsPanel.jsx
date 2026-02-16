import { useEffect, useRef } from 'react';

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

  return (
    <div className="flex flex-col flex-1 bg-vscode-panel min-w-0">
      {/* Header */}
      <div className="flex items-center h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <span className="mr-1.5">📋</span>
        Log
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto px-3 py-2 text-[11px]"
        ref={scrollRef}
      >
        {!logs || logs.length === 0 ? (
          <div className="text-vscode-text-muted italic text-center py-4">
            Click "▶" to start
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 py-1 border-b border-vscode-border last:border-b-0"
            >
              <span className="text-vscode-text-muted min-w-6 text-right">
                {idx + 1}
              </span>
              <span className={getLogColor(log)}>{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
