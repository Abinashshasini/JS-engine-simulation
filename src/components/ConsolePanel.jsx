import { useEffect, useRef } from 'react';

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
      <div className="flex items-center h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <span className="mr-1.5">💻</span>
        Console
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto px-3 py-2 font-mono text-xs"
        ref={scrollRef}
      >
        {consoleOutputs.length === 0 ? (
          <div className="text-vscode-text-muted italic">No output yet</div>
        ) : (
          consoleOutputs.map((output, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 py-0.5 text-vscode-text"
            >
              <span className="text-accent-blue">›</span>
              <span>{output}</span>
            </div>
          ))
        )}

        {/* Errors */}
        {(logs || [])
          .filter((log) => log.includes('Error') || log.includes('❌'))
          .map((error, idx) => (
            <div
              key={`err-${idx}`}
              className="flex items-start gap-2 py-0.5 text-accent-red"
            >
              <span>✗</span>
              <span>{error.replace(/❌\s*/, '')}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
