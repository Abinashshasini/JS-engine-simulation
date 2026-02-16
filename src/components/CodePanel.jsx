import { motion } from 'framer-motion';

export function CodePanel({ code, currentLine, phase }) {
  const lines = code.trim().split('\n');

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0 }}>Source Code</h3>
        <span style={phaseStyle}>{phase}</span>
      </div>

      <div style={codeBoxStyle}>
        {lines.map((line, index) => (
          <motion.div
            key={index}
            style={{
              ...lineStyle,
              background: currentLine === index ? '#3a3d41' : 'transparent',
              borderLeft:
                currentLine === index
                  ? '3px solid #007acc'
                  : '3px solid transparent',
            }}
            animate={{
              backgroundColor:
                currentLine === index ? '#3a3d41' : 'transparent',
            }}
            transition={{ duration: 0.2 }}
          >
            <span style={lineNumberStyle}>{index + 1}</span>
            <span style={lineCodeStyle}>{line || ' '}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = {
  flex: 1,
  minWidth: 300,
  maxWidth: 400,
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
  padding: '8px 12px',
  background: '#252526',
  borderRadius: '4px 4px 0 0',
};

const phaseStyle = {
  fontSize: 12,
  padding: '4px 8px',
  background: '#007acc',
  borderRadius: 4,
  color: '#fff',
};

const codeBoxStyle = {
  background: '#1e1e1e',
  border: '1px solid #3c3c3c',
  borderRadius: '0 0 4px 4px',
  fontFamily: "'Fira Code', 'Consolas', monospace",
  fontSize: 14,
  overflow: 'auto',
  maxHeight: 400,
};

const lineStyle = {
  display: 'flex',
  padding: '4px 0',
  transition: 'background 0.2s',
};

const lineNumberStyle = {
  width: 40,
  textAlign: 'right',
  paddingRight: 12,
  color: '#858585',
  userSelect: 'none',
};

const lineCodeStyle = {
  color: '#d4d4d4',
  whiteSpace: 'pre',
};
