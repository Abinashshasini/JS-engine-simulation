export function EventLoopPanel({
  callStack,
  webAPIs,
  microtaskQueue,
  macrotaskQueue,
}) {
  const formatCallback = (cb) => {
    if (typeof cb === 'string') return cb;
    if (cb && cb.log) return cb.log;
    if (typeof cb === 'object') return JSON.stringify(cb);
    return String(cb);
  };

  const QueueSection = ({
    title,
    icon,
    subtitle,
    subtitleColor,
    children,
    spanRows,
  }) => (
    <div className={`flex flex-col min-h-0 ${spanRows ? 'md:row-span-2' : ''}`}>
      <div className="flex items-center gap-1 mb-1.5 text-[10px] uppercase text-vscode-text-secondary shrink-0">
        <span className="text-xs">{icon}</span>
        <span className="truncate">{title}</span>
        {subtitle && (
          <span
            className={`ml-auto text-[9px] normal-case hidden sm:inline ${subtitleColor}`}
          >
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex-1 bg-vscode-panel border border-vscode-border rounded p-2 overflow-auto min-h-16">
        {children}
      </div>
    </div>
  );

  const QueueItem = ({ children, type }) => {
    const borderColors = {
      callstack: 'border-l-accent-green',
      webapi: 'border-l-accent-orange',
      microtask: 'border-l-accent-purple',
      macrotask: 'border-l-accent-green',
    };

    return (
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 mb-1 bg-vscode-bg rounded border-l-2 text-[11px] ${borderColors[type]}`}
      >
        {children}
      </div>
    );
  };

  const EmptyState = ({ text }) => (
    <div className="text-vscode-text-muted italic text-[10px] text-center h-full flex items-center justify-center py-2">
      {text}
    </div>
  );

  return (
    <div className="flex flex-col bg-vscode-bg flex-1 min-h-52 overflow-hidden">
      {/* Header */}
      <div className="flex items-center h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <span className="mr-1.5">🔄</span>
        Event Loop
      </div>

      {/* Content - Grid layout */}
      <div className="flex-1 overflow-auto p-3 grid grid-cols-2 md:grid-cols-2 gap-3">
        {/* Call Stack */}
        <QueueSection title="Call Stack" icon="📚" spanRows>
          {!callStack || callStack.length === 0 ? (
            <EmptyState text="No active contexts" />
          ) : (
            [...callStack].reverse().map((frame) => (
              <QueueItem key={frame.id} type="callstack">
                <span className="text-accent-yellow font-medium">
                  {frame.name}()
                </span>
                <span className="text-vscode-text-secondary ml-auto text-[10px] uppercase">
                  {frame.type}
                </span>
              </QueueItem>
            ))
          )}
        </QueueSection>

        {/* Web APIs */}
        <QueueSection
          title="Web APIs"
          icon="🌐"
          subtitle="Browser APIs"
          subtitleColor="text-accent-orange"
        >
          {Object.entries(webAPIs || {}).length === 0 ? (
            <EmptyState text="No pending APIs" />
          ) : (
            Object.entries(webAPIs).map(([id, api]) => (
              <QueueItem key={id} type="webapi">
                <span className="text-accent-orange">{api.type}</span>
                <span className="text-accent-cyan ml-2">
                  {formatCallback(api.callback)}
                </span>
                {api.delay !== undefined && (
                  <span className="text-vscode-text-secondary ml-auto">
                    {api.delay}ms
                  </span>
                )}
              </QueueItem>
            ))
          )}
        </QueueSection>

        {/* Microtask Queue */}
        <QueueSection
          title="Microtask Queue"
          icon="⚡"
          subtitle="Promises"
          subtitleColor="text-accent-purple"
        >
          {!microtaskQueue || microtaskQueue.length === 0 ? (
            <EmptyState text="No microtasks" />
          ) : (
            microtaskQueue.map((task, idx) => (
              <QueueItem key={idx} type="microtask">
                <span className="text-vscode-text-secondary min-w-4">
                  {idx + 1}
                </span>
                <span className="text-accent-purple">
                  {formatCallback(task)}
                </span>
              </QueueItem>
            ))
          )}
        </QueueSection>

        {/* Macrotask Queue */}
        <QueueSection
          title="Macrotask Queue"
          icon="📦"
          subtitle="setTimeout"
          subtitleColor="text-accent-green"
        >
          {!macrotaskQueue || macrotaskQueue.length === 0 ? (
            <EmptyState text="No macrotasks" />
          ) : (
            macrotaskQueue.map((task, idx) => (
              <QueueItem key={task.id || idx} type="macrotask">
                <span className="text-vscode-text-secondary min-w-4">
                  {idx + 1}
                </span>
                <span className="text-accent-green">{task.type}</span>
                <span className="text-accent-cyan ml-2">
                  {formatCallback(task.callback)}
                </span>
              </QueueItem>
            ))
          )}
        </QueueSection>
      </div>
    </div>
  );
}
