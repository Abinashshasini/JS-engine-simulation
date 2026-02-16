export function WebAPIs({ apis = {} }) {
  const entries = Object.entries(apis || {});

  return (
    <div style={containerStyle}>
      <h3>Web APIs</h3>
      <div style={boxStyle}>
        {entries.length === 0 && <div style={emptyStyle}>Empty</div>}

        {entries.map(([id, api]) => (
          <div key={id} style={itemStyle}>
            <div style={{ fontWeight: 'bold' }}>{api.type}</div>
            <div style={{ fontSize: 12, color: '#cfcfcf' }}>
              {String(api.callback)}
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
  background: '#222',
  border: '1px solid #444',
  color: '#eee',
};

const emptyStyle = {
  color: '#777',
  textAlign: 'center',
  marginTop: 80,
};
