import { motion, AnimatePresence } from 'framer-motion';

export function MemoryAllocation({ contexts, phase }) {
  if (!contexts || contexts.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Memory Allocation</h3>
        <div style={emptyStyle}>No execution context yet</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        Memory Allocation
        <span style={phaseTagStyle}>{phase}</span>
      </h3>

      <AnimatePresence>
        {contexts.map((ctx) => (
          <motion.div
            key={ctx.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={contextBoxStyle}
          >
            <div style={contextHeaderStyle}>
              <span style={contextNameStyle}>{ctx.name}</span>
              <span style={contextTypeStyle}>{ctx.type} context</span>
            </div>

            {/* Variable Environment (var, function) */}
            <div style={envSectionStyle}>
              <div style={envTitleStyle}>
                <span style={{ color: '#4ec9b0' }}>Variable Environment</span>
                <span style={subtitleStyle}>(var, function declarations)</span>
              </div>

              {Object.keys(ctx.variableEnvironment || {}).length === 0 ? (
                <div style={emptyEnvStyle}>Empty</div>
              ) : (
                <div style={variablesGridStyle}>
                  {Object.entries(ctx.variableEnvironment).map(
                    ([name, record]) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={variableRowStyle}
                      >
                        <span style={varNameStyle}>{name}</span>
                        <span style={kindTagStyle(record.kind)}>
                          {record.kind}
                        </span>
                        <span style={valueStyle(record)}>
                          {formatValue(record)}
                        </span>
                      </motion.div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Lexical Environment (let, const) */}
            <div style={envSectionStyle}>
              <div style={envTitleStyle}>
                <span style={{ color: '#c586c0' }}>Lexical Environment</span>
                <span style={subtitleStyle}>(let, const - TDZ)</span>
              </div>

              {Object.keys(ctx.lexicalEnvironment || {}).length === 0 ? (
                <div style={emptyEnvStyle}>Empty</div>
              ) : (
                <div style={variablesGridStyle}>
                  {Object.entries(ctx.lexicalEnvironment).map(
                    ([name, record]) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          ...variableRowStyle,
                          background: !record.initialized
                            ? '#4a2020'
                            : '#2d2d30',
                        }}
                      >
                        <span style={varNameStyle}>{name}</span>
                        <span style={kindTagStyle(record.kind)}>
                          {record.kind}
                        </span>
                        <span style={valueStyle(record)}>
                          {!record.initialized ? (
                            <span style={tdzStyle}>⚠️ TDZ</span>
                          ) : (
                            formatValue(record)
                          )}
                        </span>
                      </motion.div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* this binding */}
            {ctx.thisBinding && (
              <div style={thisBindingStyle}>
                <span style={{ color: '#569cd6' }}>this</span>
                <span style={{ color: '#9cdcfe', marginLeft: 8 }}>
                  {ctx.thisBinding.type || 'undefined'}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function formatValue(record) {
  if (record.kind === 'function' && record.value && record.value.name) {
    return `ƒ ${record.value.name}()`;
  }
  if (record.value === undefined) {
    return 'undefined';
  }
  if (typeof record.value === 'string') {
    return `"${record.value}"`;
  }
  return String(record.value);
}

const containerStyle = {
  minWidth: 320,
  maxWidth: 400,
};

const titleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 12,
  color: '#fff',
};

const phaseTagStyle = {
  fontSize: 11,
  padding: '2px 8px',
  background: '#6a9955',
  borderRadius: 4,
  color: '#fff',
  fontWeight: 'normal',
};

const contextBoxStyle = {
  background: '#252526',
  border: '1px solid #3c3c3c',
  borderRadius: 6,
  marginBottom: 12,
  overflow: 'hidden',
};

const contextHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 12px',
  background: '#333333',
  borderBottom: '1px solid #3c3c3c',
};

const contextNameStyle = {
  fontWeight: 'bold',
  color: '#dcdcaa',
  fontSize: 14,
};

const contextTypeStyle = {
  fontSize: 11,
  color: '#888',
};

const envSectionStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #3c3c3c',
};

const envTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
  fontSize: 12,
};

const subtitleStyle = {
  color: '#666',
  fontSize: 10,
};

const emptyEnvStyle = {
  color: '#555',
  fontStyle: 'italic',
  fontSize: 12,
};

const variablesGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const variableRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '6px 10px',
  background: '#2d2d30',
  borderRadius: 4,
  fontSize: 13,
};

const varNameStyle = {
  color: '#9cdcfe',
  fontWeight: 500,
  minWidth: 60,
};

const kindTagStyle = (kind) => ({
  fontSize: 10,
  padding: '2px 6px',
  borderRadius: 3,
  background:
    kind === 'var'
      ? '#3a5a40'
      : kind === 'let'
        ? '#5a3a40'
        : kind === 'const'
          ? '#3a405a'
          : '#4a4a20',
  color: '#fff',
});

const valueStyle = (record) => ({
  color: record.initialized ? '#ce9178' : '#666',
  marginLeft: 'auto',
});

const tdzStyle = {
  color: '#f14c4c',
  fontWeight: 'bold',
};

const thisBindingStyle = {
  padding: '8px 12px',
  fontSize: 12,
};

const emptyStyle = {
  color: '#555',
  textAlign: 'center',
  padding: 40,
  background: '#252526',
  borderRadius: 6,
};
