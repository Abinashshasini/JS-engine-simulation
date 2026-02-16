import { motion, AnimatePresence } from 'framer-motion';

export function MemoryPanel({ contexts, phase }) {
  const formatValue = (record) => {
    if (record.kind === 'function' && record.value && record.value.name) {
      return `ƒ ${record.value.name}()`;
    }
    if (record.value === undefined) return 'undefined';
    if (typeof record.value === 'string') return `"${record.value}"`;
    return String(record.value);
  };

  const getScopeChain = (ctx) => {
    const chain = [];
    let current = ctx.outer;
    while (current) {
      chain.push(current.name);
      current = current.outer;
    }
    return chain;
  };

  const getKindColor = (kind) => {
    switch (kind) {
      case 'var':
        return 'bg-green-900/50 text-green-300';
      case 'let':
        return 'bg-red-900/30 text-red-300';
      case 'const':
        return 'bg-blue-900/50 text-blue-300';
      case 'function':
        return 'bg-yellow-900/40 text-yellow-300';
      default:
        return 'bg-vscode-input text-vscode-text';
    }
  };

  const phaseColors = {
    creation: 'border-accent-cyan',
    execution: 'border-accent-yellow',
    'event-loop': 'border-accent-purple',
    done: 'border-accent-green',
  };

  return (
    <div className="flex flex-col bg-vscode-bg border-b lg:border-b-0 lg:border-r border-vscode-border min-h-40 max-h-64 md:min-h-0 md:max-h-none md:h-auto md:w-72 lg:w-80 shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <div className="flex items-center">
          <span className="mr-1.5">🧠</span>
          Memory
        </div>
        {contexts && contexts.length > 0 && (
          <span className="text-[9px] text-accent-yellow font-mono">
            {contexts.length} context{contexts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        {!contexts || contexts.length === 0 ? (
          <div className="text-vscode-text-muted italic text-center py-10 animate-float">
            <div className="text-3xl mb-2">📦</div>
            Click "▶" to start execution
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {[...contexts].reverse().map((ctx, idx) => (
              <motion.div
                key={ctx.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                layout
                className={`bg-vscode-panel border rounded mb-2 overflow-hidden ${
                  idx === 0
                    ? `border-l-2 ${phaseColors[phase] || 'border-vscode-border'} animate-border-glow`
                    : 'border-vscode-border'
                }`}
              >
                {/* Context Header */}
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-vscode-active border-b border-vscode-border">
                  <span className="font-semibold text-accent-yellow text-xs">
                    {ctx.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {idx === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    )}
                    <span className="text-[10px] text-vscode-text-secondary uppercase">
                      {ctx.type}
                    </span>
                  </div>
                </div>

                {/* Variable Environment */}
                <div className="px-2.5 py-2 border-b border-vscode-border">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[10px]">
                    <span className="font-medium text-accent-green">
                      Variable Environment
                    </span>
                    <span className="text-vscode-text-muted text-[9px]">
                      var, function
                    </span>
                  </div>
                  {Object.keys(ctx.variableEnvironment || {}).length === 0 ? (
                    <div className="text-vscode-text-muted italic text-[11px]">
                      Empty
                    </div>
                  ) : (
                    <AnimatePresence>
                      {Object.entries(ctx.variableEnvironment).map(
                        ([name, record]) => (
                          <motion.div
                            key={name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-1.5 px-1.5 py-1 mb-1 bg-vscode-bg rounded text-[11px] animate-fade-slide-up"
                          >
                            <span className="text-accent-cyan min-w-12">
                              {name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded uppercase ${getKindColor(record.kind)}`}
                            >
                              {record.kind}
                            </span>
                            <motion.span
                              key={String(record.value)}
                              initial={{ scale: 1.3, color: '#007acc' }}
                              animate={{
                                scale: 1,
                                color:
                                  record.value === undefined
                                    ? '#6a6a6a'
                                    : '#ce9178',
                              }}
                              transition={{ duration: 0.3 }}
                              className={`ml-auto ${record.value === undefined ? 'italic' : ''}`}
                            >
                              {formatValue(record)}
                            </motion.span>
                          </motion.div>
                        ),
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* Lexical Environment */}
                <div className="px-2.5 py-2">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[10px]">
                    <span className="font-medium text-accent-purple">
                      Lexical Environment
                    </span>
                    <span className="text-vscode-text-muted text-[9px]">
                      let, const
                    </span>
                  </div>
                  {Object.keys(ctx.lexicalEnvironment || {}).length === 0 ? (
                    <div className="text-vscode-text-muted italic text-[11px]">
                      Empty
                    </div>
                  ) : (
                    <AnimatePresence>
                      {Object.entries(ctx.lexicalEnvironment).map(
                        ([name, record]) => (
                          <motion.div
                            key={name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center gap-1.5 px-1.5 py-1 mb-1 rounded text-[11px] animate-fade-slide-up ${
                              !record.initialized
                                ? 'bg-red-500/15 border-l-2 border-accent-red'
                                : 'bg-vscode-bg'
                            }`}
                          >
                            <span className="text-accent-cyan min-w-12">
                              {name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded uppercase ${getKindColor(record.kind)}`}
                            >
                              {record.kind}
                            </span>
                            <motion.span
                              key={
                                !record.initialized
                                  ? 'tdz'
                                  : String(record.value)
                              }
                              initial={
                                !record.initialized
                                  ? { scale: 1.2 }
                                  : { scale: 1.3, color: '#007acc' }
                              }
                              animate={
                                !record.initialized
                                  ? { scale: [1, 1.05, 1], color: '#f14c4c' }
                                  : { scale: 1, color: '#ce9178' }
                              }
                              transition={
                                !record.initialized
                                  ? { duration: 1.5, repeat: Infinity }
                                  : { duration: 0.3 }
                              }
                              className={`ml-auto ${!record.initialized ? 'font-medium' : ''}`}
                            >
                              {!record.initialized
                                ? '⛔ TDZ'
                                : formatValue(record)}
                            </motion.span>
                          </motion.div>
                        ),
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* Scope Chain */}
                {ctx.outer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="px-2.5 py-1.5 text-[10px] border-t border-vscode-border flex items-center gap-1.5 flex-wrap"
                  >
                    <span className="text-vscode-text-secondary">Scope:</span>
                    <span className="text-accent-purple">{ctx.name}</span>
                    {getScopeChain(ctx).map((name, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="text-vscode-text-muted">→</span>
                        <span className="text-accent-purple">{name}</span>
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* this binding */}
                {ctx.thisBinding && (
                  <div className="px-2.5 py-1.5 text-[10px] border-t border-vscode-border flex items-center gap-1">
                    <span className="text-blue-400">this:</span>
                    <span className="text-accent-cyan">
                      {ctx.thisBinding.type || 'undefined'}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
