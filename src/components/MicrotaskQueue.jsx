export function MicrotaskQueue({ queue = [] }) {
  return (
    <div style={containerStyle}>
      <h3>Microtask Queue</h3>
      <div style={boxStyle}>
        {queue.length === 0 && <div style={emptyStyle}>Empty</div>}

        {queue.map((task, index) => (
          <div key={index} style={itemStyle}>
            {typeof task === 'string' && <div>{task}</div>}
            {task && task.log && <div>log: {task.log}</div>}
            {task && task.scheduleMicrotask && (
              <div>schedule: {String(task.scheduleMicrotask)}</div>
            )}
            {!task && <div>{String(task)}</div>}
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
  background: '#1b1b1b',
  border: '1px solid #555',
  color: '#eee',
};

const emptyStyle = {
  color: '#777',
  textAlign: 'center',
  marginTop: 80,
};
