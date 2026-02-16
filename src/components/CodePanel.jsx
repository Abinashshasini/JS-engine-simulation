// Simple syntax highlighter for JavaScript
function highlightCode(line) {
  const tokens = [];
  let remaining = line;
  let key = 0;

  const patterns = [
    // Comments
    { regex: /^(\/\/.*)/, className: 'text-vscode-comment' },
    // Strings (single, double, template)
    { regex: /^("[^"]*"|'[^']*'|`[^`]*`)/, className: 'text-vscode-orange' },
    // Numbers
    { regex: /^(\b\d+\.?\d*\b)/, className: 'text-vscode-green' },
    // Keywords
    {
      regex:
        /^(\b(?:const|let|var|function|return|if|else|for|while|new|async|await|try|catch|finally|throw|class|extends|import|export|default|from)\b)/,
      className: 'text-vscode-purple',
    },
    // Built-ins
    {
      regex:
        /^(\b(?:console|Promise|setTimeout|setInterval|clearTimeout|clearInterval|JSON|Array|Object|Math|Date|Error|undefined|null|true|false|this)\b)/,
      className: 'text-vscode-blue',
    },
    // Method calls (.methodName)
    {
      regex:
        /^(\.(?:log|then|catch|finally|resolve|reject|all|race|push|pop|map|filter|reduce|forEach|slice|splice|join|split|includes|indexOf|toString|valueOf)\b)/,
      className: 'text-vscode-yellow',
    },
    // Function names (before parenthesis)
    {
      regex: /^(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)(?=\s*\()/,
      className: 'text-vscode-yellow',
    },
    // Arrow functions
    { regex: /^(=>)/, className: 'text-vscode-purple' },
    // Operators
    { regex: /^([+\-*/%=<>!&|?:]+)/, className: 'text-vscode-fg' },
    // Punctuation
    { regex: /^([{}()\[\];,])/, className: 'text-vscode-fg' },
    // Identifiers
    { regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)/, className: 'text-vscode-cyan' },
    // Whitespace
    { regex: /^(\s+)/, className: '' },
    // Any other character
    { regex: /^(.)/, className: 'text-vscode-fg' },
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const { regex, className } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        const text = match[1];
        tokens.push(
          <span key={key++} className={className}>
            {text}
          </span>,
        );
        remaining = remaining.slice(text.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push(<span key={key++}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
  }

  return tokens.length > 0 ? tokens : ' ';
}

export function CodePanel({ code, currentLine }) {
  const lines = code.trim().split('\n');

  return (
    <div className="flex flex-col bg-vscode-bg border-b md:border-b-0 md:border-r border-vscode-border min-h-32 max-h-52 md:min-h-0 md:max-h-none md:h-auto md:w-64 lg:w-72 shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <span className="mr-1.5">📄</span>
        Code
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto py-1 font-mono text-xs leading-5">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`flex px-2 min-h-5 transition-colors duration-150 ${
              currentLine === index
                ? 'bg-accent-blue/30'
                : 'hover:bg-vscode-hover'
            }`}
          >
            <span
              className={`w-6 text-right pr-2 select-none shrink-0 text-[11px] ${
                currentLine === index
                  ? 'text-accent-blue'
                  : 'text-vscode-text-muted'
              }`}
            >
              {index + 1}
            </span>
            <span className="whitespace-pre text-[12px]">
              {highlightCode(line)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
