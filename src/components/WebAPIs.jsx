import { motion, AnimatePresence } from 'framer-motion';

export function WebAPIs({ apis = {} }) {
  const entries = Object.entries(apis || {});

  return (
    <div style={containerStyle}>
      <h4 style={titleStyle}>🌐 Web APIs</h4>
      <div style={boxStyle}>
        {entries.length === 0 && <div style={emptyStyle}>Empty</div>}

        <AnimatePresence>
          {entries.map(([id, api]) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={itemStyle}
            >
              <span style={typeStyle}>{api.type}</span>
              <span style={callbackStyle}>{String(api.callback)}</span>
              {api.delay !== undefined && (
                <span style={delayStyle}>{api.delay}ms</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const containerStyle = { flex: 1 };

const titleStyle = {
  margin: '0 0 10px',
  fontSize: 13,
  color: '#ce9178',
};

const boxStyle = {
  border: '1px solid #3c3c3c',
  borderRadius: 4,
  minHeight: 80,
  maxHeight: 150,
  padding: 8,
  background: '#1a1a1a',
  overflow: 'auto',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  marginBottom: 4,
  background: '#2a2a2a',
  borderRadius: 4,
  borderLeft: '3px solid #ce9178',
};

const typeStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: '#dcdcaa',
};

const callbackStyle = {
  fontSize: 11,
  color: '#9cdcfe',
  flex: 1,
};

const delayStyle = {
  fontSize: 10,
  color: '#888',
};

const emptyStyle = {
  color: '#555',
  textAlign: 'center',
  padding: 20,
  fontSize: 12,
};
