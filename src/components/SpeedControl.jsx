const speeds = [0.5, 1, 2, 3];

export function SpeedControl({ speed, onSpeedChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-vscode-comment text-xs">Speed:</span>
      <div className="flex gap-1">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`
              px-2 py-0.5 text-xs rounded transition-colors
              ${
                speed === s
                  ? 'bg-vscode-blue text-white'
                  : 'bg-vscode-panel text-vscode-fg hover:bg-vscode-border'
              }
            `}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
