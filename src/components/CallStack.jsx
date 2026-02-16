import { motion, AnimatePresence } from 'framer-motion';

export function CallStack({ stack }) {
  return (
    <div style={containerStyle}>
      <h3>Call Stack</h3>

      <div style={stackStyle}>
        <AnimatePresence>
          {[...stack].reverse().map((frame) => (
            <motion.div
              key={frame.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={frameStyle}
            >
              <div style={{ fontWeight: 'bold' }}>
                {frame.name} ({frame.type})
              </div>

              <div style={{ marginTop: 6, fontSize: 12 }}>
                <div style={{ color: '#9cdcfe' }}>Lexical:</div>
                {Object.keys(frame.lexicalEnvironment || {}).length === 0 ? (
                  <div style={{ color: '#777' }}>—</div>
                ) : (
                  Object.entries(frame.lexicalEnvironment).map(([k, v]) => (
                    <div key={k} style={{ color: '#c5c5c5' }}>
                      {k}: {String(v.value)}
                    </div>
                  ))
                )}

                <div style={{ color: '#9cdcfe', marginTop: 6 }}>Vars:</div>
                {Object.keys(frame.variableEnvironment || {}).length === 0 ? (
                  <div style={{ color: '#777' }}>—</div>
                ) : (
                  Object.entries(frame.variableEnvironment).map(([k, v]) => (
                    <div key={k} style={{ color: '#c5c5c5' }}>
                      {k}: {String(v.value)}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {(!stack || stack.length === 0) && <div style={emptyStyle}>Empty</div>}
      </div>
    </div>
  );
}

const containerStyle = {
  width: 220,
};

const stackStyle = {
  border: '2px solid #333',
  minHeight: 250,
  padding: 10,
  display: 'flex',
  flexDirection: 'column-reverse',
  overflow: 'hidden',
};

const frameStyle = {
  padding: 10,
  margin: 5,
  background: '#1e1e1e',
  border: '1px solid #555',
};

const emptyStyle = {
  color: '#777',
  textAlign: 'center',
  marginTop: 100,
};
