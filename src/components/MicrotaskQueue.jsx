import { motion, AnimatePresence } from 'framer-motion';

export function MicrotaskQueue({ queue = [] }) {
  const formatTask = (task) => {
    if (typeof task === 'string') return task;
    if (task && task.log) return task.log;
    if (task && typeof task === 'object') return JSON.stringify(task);
    return String(task);
  };

  return (
    <div style={containerStyle}>
      <h4 style={titleStyle}>🔹 Microtask Queue</h4>
      <div style={boxStyle}>
        {queue.length === 0 && <div style={emptyStyle}>Empty</div>}

        <AnimatePresence>
          {queue.map((task, index) => (
            <motion.div
              key={`micro-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={itemStyle}
            >
              <span style={indexStyle}>{index + 1}</span>
              <span style={taskStyle}>{formatTask(task)}</span>
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
  color: '#c586c0',
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
  background: '#2a2a3a',
  borderRadius: 4,
  borderLeft: '3px solid #c586c0',
};

const indexStyle = {
  fontSize: 10,
  color: '#888',
  minWidth: 16,
};

const taskStyle = {
  fontSize: 11,
  color: '#e0e0e0',
};

const emptyStyle = {
  color: '#555',
  textAlign: 'center',
  padding: 20,
  fontSize: 12,
};
