import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
  const scrollRef = useRef(null);
  const lineRefs = useRef([]);

  // Auto-scroll to current line
  useEffect(() => {
    if (
      currentLine >= 0 &&
      lineRefs.current[currentLine] &&
      scrollRef.current
    ) {
      const lineEl = lineRefs.current[currentLine];
      const container = scrollRef.current;
      const lineTop = lineEl.offsetTop;
      const lineHeight = lineEl.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      if (
        lineTop < scrollTop ||
        lineTop + lineHeight > scrollTop + containerHeight
      ) {
        container.scrollTo({
          top: lineTop - containerHeight / 3,
          behavior: 'smooth',
        });
      }
    }
  }, [currentLine]);

  return (
    <div className="flex flex-col bg-vscode-bg border-b md:border-b-0 md:border-r border-vscode-border min-h-32 max-h-52 md:min-h-0 md:max-h-none md:h-auto md:w-64 lg:w-72 shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-3 bg-vscode-panel border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-text-secondary shrink-0">
        <div className="flex items-center">
          <span className="mr-1.5">📄</span>
          Code
        </div>
        {currentLine >= 0 && (
          <span className="text-[9px] text-accent-blue font-mono">
            Ln {currentLine + 1}
          </span>
        )}
      </div>

      {/* Code Content */}
      <div
        className="flex-1 overflow-auto py-1 font-mono text-xs leading-5"
        ref={scrollRef}
      >
        {lines.map((line, index) => {
          const isActive = currentLine === index;
          return (
            <div
              key={index}
              ref={(el) => (lineRefs.current[index] = el)}
              className={`flex px-2 min-h-5 transition-all duration-200 relative ${
                isActive
                  ? 'bg-accent-blue/20 animate-glow-pulse'
                  : 'hover:bg-vscode-hover'
              }`}
            >
              {/* Active line left indicator */}
              {isActive && (
                <motion.div
                  layoutId="codeLine"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-blue rounded-r"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={`w-6 text-right pr-2 select-none shrink-0 text-[11px] transition-colors duration-200 ${
                  isActive
                    ? 'text-accent-blue font-medium'
                    : 'text-vscode-text-muted'
                }`}
              >
                {index + 1}
              </span>
              <span className="whitespace-pre text-[12px]">
                {highlightCode(line)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
