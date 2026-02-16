export function MacrotaskQueue({ queue = [] }) {
  return (
    <div style={containerStyle}>
      <h3>Macrotask Queue</h3>
      <div style={boxStyle}>
        {queue.length === 0 && <div style={emptyStyle}>Empty</div>}

        {queue.map((task, index) => (
          <div key={task.id || index} style={itemStyle}>
            <div style={{ fontWeight: 'bold' }}>{task.type}</div>
            <div style={{ fontSize: 12, color: '#cfcfcf' }}>
              {typeof task.callback === 'string'
                ? task.callback
                : JSON.stringify(task.callback)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = { width: 200 };

const boxStyle = {
  border: '2px solid #333',
  minHeight: 200,
  padding: 8,
};

const itemStyle = {
  padding: 8,
  margin: 4,
  background: '#252525',
  border: '1px solid #555',
  color: '#eee',
};

const emptyStyle = {
  color: '#777',
  textAlign: 'center',
  marginTop: 80,
};
