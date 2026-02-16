export function Logs({ logs }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Execution Log</h3>
      <div style={logBoxStyle}>
        {logs.map((log, index) => (
          <div key={index} style={logItemStyle}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

const logBoxStyle = {
  border: '2px solid #333',
  minHeight: 150,
  padding: 10,
  background: '#111',
};

const logItemStyle = {
  marginBottom: 4,
  fontSize: 14,
  color: '#eee',
};
