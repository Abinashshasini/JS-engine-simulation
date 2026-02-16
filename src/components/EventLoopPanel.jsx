import { motion, AnimatePresence } from 'framer-motion';

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

  const hasActivity =
    (callStack && callStack.length > 0) ||
    Object.keys(webAPIs || {}).length > 0 ||
    (microtaskQueue && microtaskQueue.length > 0) ||
    (macrotaskQueue && macrotaskQueue.length > 0);

  const QueueSection = ({
    title,
    icon,
    subtitle,
    subtitleColor,
    children,
    count,
    spanRows,
  }) => (
    <div className={`flex flex-col min-h-0 ${spanRows ? 'md:row-span-2' : ''}`}>
      <div className="flex items-center gap-1 mb-1.5 text-[10px] uppercase text-vscode-text-secondary shrink-0">
        <span className="text-xs">{icon}</span>
        <span className="truncate">{title}</span>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-1 bg-accent-blue/20 text-accent-blue text-[9px] px-1.5 py-0.5 rounded-full font-mono"
          >
            {count}
          </motion.span>
        )}
        {subtitle && (
          <span
            className={`ml-auto text-[9px] normal-case hidden sm:inline ${subtitleColor}`}
          >
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex-1 bg-vscode-panel border border-vscode-border rounded p-2 overflow-auto min-h-16 transition-colors duration-300">
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
      <motion.div
        initial={{ opacity: 0, x: -12, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        layout
        className={`flex items-center gap-1.5 px-2 py-1.5 mb-1 bg-vscode-bg rounded border-l-2 text-[11px] ${borderColors[type]}`}
      >
        {children}
      </motion.div>
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
        <span
          className={`mr-1.5 inline-block ${hasActivity ? 'animate-spin-slow' : ''}`}
        >
          🔄
        </span>
        Event Loop
        {hasActivity && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-auto text-[9px] text-accent-green font-mono flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            Active
          </motion.span>
        )}
      </div>

      {/* Content - Grid layout */}
      <div className="flex-1 overflow-auto p-3 grid grid-cols-2 md:grid-cols-2 gap-3">
        {/* Call Stack */}
        <QueueSection
          title="Call Stack"
          icon="📚"
          count={callStack?.length || 0}
          spanRows
        >
          {!callStack || callStack.length === 0 ? (
            <EmptyState text="No active contexts" />
          ) : (
            <AnimatePresence mode="popLayout">
              {[...callStack].reverse().map((frame) => (
                <QueueItem key={frame.id} type="callstack">
                  <span className="text-accent-yellow font-medium">
                    {frame.name}()
                  </span>
                  <span className="text-vscode-text-secondary ml-auto text-[10px] uppercase">
                    {frame.type}
                  </span>
                </QueueItem>
              ))}
            </AnimatePresence>
          )}
        </QueueSection>

        {/* Web APIs */}
        <QueueSection
          title="Web APIs"
          icon="🌐"
          subtitle="Browser APIs"
          subtitleColor="text-accent-orange"
          count={Object.keys(webAPIs || {}).length}
        >
          {Object.entries(webAPIs || {}).length === 0 ? (
            <EmptyState text="No pending APIs" />
          ) : (
            <AnimatePresence mode="popLayout">
              {Object.entries(webAPIs).map(([id, api]) => (
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
              ))}
            </AnimatePresence>
          )}
        </QueueSection>

        {/* Microtask Queue */}
        <QueueSection
          title="Microtask Queue"
          icon="⚡"
          subtitle="Promises"
          subtitleColor="text-accent-purple"
          count={microtaskQueue?.length || 0}
        >
          {!microtaskQueue || microtaskQueue.length === 0 ? (
            <EmptyState text="No microtasks" />
          ) : (
            <AnimatePresence mode="popLayout">
              {microtaskQueue.map((task, idx) => (
                <QueueItem key={`micro-${idx}`} type="microtask">
                  <span className="text-vscode-text-secondary min-w-4">
                    {idx + 1}
                  </span>
                  <span className="text-accent-purple">
                    {formatCallback(task)}
                  </span>
                </QueueItem>
              ))}
            </AnimatePresence>
          )}
        </QueueSection>

        {/* Macrotask Queue */}
        <QueueSection
          title="Macrotask Queue"
          icon="📦"
          subtitle="setTimeout"
          subtitleColor="text-accent-green"
          count={macrotaskQueue?.length || 0}
        >
          {!macrotaskQueue || macrotaskQueue.length === 0 ? (
            <EmptyState text="No macrotasks" />
          ) : (
            <AnimatePresence mode="popLayout">
              {macrotaskQueue.map((task, idx) => (
                <QueueItem key={task.id || `macro-${idx}`} type="macrotask">
                  <span className="text-vscode-text-secondary min-w-4">
                    {idx + 1}
                  </span>
                  <span className="text-accent-green">{task.type}</span>
                  <span className="text-accent-cyan ml-2">
                    {formatCallback(task.callback)}
                  </span>
                </QueueItem>
              ))}
            </AnimatePresence>
          )}
        </QueueSection>
      </div>
    </div>
  );
}
