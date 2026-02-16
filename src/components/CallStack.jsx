import { motion, AnimatePresence } from 'framer-motion';

export function CallStack({ stack }) {
  return (
    <div style={containerStyle}>
      <h4 style={titleStyle}>📚 Call Stack</h4>

      <div style={stackStyle}>
        <AnimatePresence>
          {[...(stack || [])].reverse().map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                ...frameStyle,
                background: index === stack.length - 1 ? '#2d4a3e' : '#2d2d30',
                borderLeft:
                  index === stack.length - 1
                    ? '3px solid #4caf50'
                    : '3px solid #555',
              }}
            >
              <span style={frameNameStyle}>{frame.name}</span>
              <span style={frameTypeStyle}>{frame.type}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {(!stack || stack.length === 0) && (
          <div style={emptyStyle}>Stack Empty</div>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  flex: 1,
};

const titleStyle = {
  margin: '0 0 10px',
  fontSize: 13,
  color: '#9cdcfe',
};

const stackStyle = {
  border: '1px solid #3c3c3c',
  borderRadius: 4,
  minHeight: 120,
  maxHeight: 200,
  padding: 8,
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: 4,
  overflow: 'auto',
  background: '#1a1a1a',
};

const frameStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 10px',
  borderRadius: 4,
};

const frameNameStyle = {
  fontWeight: 600,
  color: '#dcdcaa',
  fontSize: 12,
};

const frameTypeStyle = {
  fontSize: 10,
  color: '#888',
  textTransform: 'uppercase',
};

const emptyStyle = {
  color: '#555',
  textAlign: 'center',
  padding: 30,
  fontSize: 12,
};
