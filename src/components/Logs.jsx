import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Logs({ logs = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (log) => {
    if (log.includes('CREATION PHASE'))
      return { ...logItemStyle, color: '#4ec9b0', fontWeight: 600 };
    if (log.includes('EXECUTION PHASE'))
      return { ...logItemStyle, color: '#dcdcaa', fontWeight: 600 };
    if (log.includes('EVENT LOOP'))
      return { ...logItemStyle, color: '#c586c0', fontWeight: 600 };
    if (log.includes('console.log'))
      return { ...logItemStyle, color: '#ce9178' };
    if (log.includes('Error') || log.includes('❌'))
      return { ...logItemStyle, color: '#f14c4c' };
    if (log.includes('TDZ')) return { ...logItemStyle, color: '#f14c4c' };
    if (log.includes('memory allocated'))
      return { ...logItemStyle, color: '#9cdcfe' };
    if (log.includes('Context')) return { ...logItemStyle, color: '#569cd6' };
    if (log.includes('Function')) return { ...logItemStyle, color: '#dcdcaa' };
    return logItemStyle;
  };

  return (
    <div>
      <h3 style={titleStyle}>📋 Execution Log</h3>
      <div ref={scrollRef} style={logBoxStyle}>
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              style={getLogStyle(log)}
            >
              <span style={indexStyle}>{index + 1}</span>
              {log}
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length === 0 && (
          <div style={emptyStyle}>Click "Next Step" to start execution</div>
        )}
      </div>
    </div>
  );
}

const titleStyle = {
  margin: '0 0 12px',
  fontSize: 16,
  color: '#fff',
};

const logBoxStyle = {
  border: '1px solid #3c3c3c',
  borderRadius: 4,
  minHeight: 120,
  maxHeight: 250,
  padding: 12,
  background: '#0d0d0d',
  overflow: 'auto',
  fontFamily: "'Fira Code', 'Consolas', monospace",
};

const logItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  marginBottom: 6,
  fontSize: 13,
  color: '#e0e0e0',
  lineHeight: 1.4,
};

const indexStyle = {
  color: '#555',
  fontSize: 11,
  minWidth: 24,
  textAlign: 'right',
};

const emptyStyle = {
  color: '#555',
  textAlign: 'center',
  padding: 40,
  fontSize: 13,
};
