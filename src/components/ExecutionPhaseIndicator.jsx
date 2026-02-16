import { motion } from 'framer-motion';

export function ExecutionPhaseIndicator({ phase, stepCount, totalSteps }) {
  const phases = [
    { id: 'idle', label: 'Ready', icon: '⏸️' },
    { id: 'creation', label: 'Creation Phase', icon: '🏗️' },
    { id: 'execution', label: 'Execution Phase', icon: '▶️' },
    { id: 'event-loop', label: 'Event Loop', icon: '🔄' },
    { id: 'done', label: 'Complete', icon: '✅' },
  ];

  return (
    <div style={containerStyle}>
      <div style={phasesRowStyle}>
        {phases.map((p, index) => {
          const isActive = p.id === phase;
          const isPast = phases.findIndex((x) => x.id === phase) > index;

          return (
            <div key={p.id} style={phaseItemStyle}>
              <motion.div
                style={{
                  ...phaseCircleStyle,
                  background: isActive
                    ? '#007acc'
                    : isPast
                      ? '#6a9955'
                      : '#3c3c3c',
                  border: isActive
                    ? '2px solid #007acc'
                    : '2px solid transparent',
                }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {p.icon}
              </motion.div>
              <span
                style={{
                  ...phaseLabelStyle,
                  color: isActive ? '#fff' : isPast ? '#6a9955' : '#666',
                }}
              >
                {p.label}
              </span>
              {index < phases.length - 1 && (
                <div
                  style={{
                    ...connectorStyle,
                    background: isPast ? '#6a9955' : '#3c3c3c',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={progressStyle}>
        Step {stepCount} / {totalSteps}
      </div>
    </div>
  );
}

const containerStyle = {
  padding: '12px 16px',
  background: '#252526',
  borderRadius: 6,
  marginBottom: 16,
};

const phasesRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 8,
};

const phaseItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
};

const phaseCircleStyle = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
};

const phaseLabelStyle = {
  fontSize: 10,
  marginTop: 4,
  textAlign: 'center',
  maxWidth: 70,
};

const connectorStyle = {
  position: 'absolute',
  top: 18,
  left: 50,
  width: 30,
  height: 2,
};

const progressStyle = {
  textAlign: 'center',
  fontSize: 12,
  color: '#888',
};
