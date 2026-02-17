<div align="center">

<h1>🧠 JS Engine + Event Loop</h1>

<br />

**Finally understand what really happens when JavaScript executes — visualized step-by-step in real-time.**

<br />

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br />

[Launch Demo](#-getting-started) · [Features](#-features) · [Scenarios](#-learning-scenarios) · [Tech](#-built-with)

</div>

---

<br />

## 🤔 What Is This?

Ever wondered what _actually_ happens when you write `setTimeout(() => console.log('Hi'), 0)`?

**Why does it log after synchronous code?**

This interactive visualizer shows you the JavaScript engine's inner workings frame-by-frame:

- **Call Stack** execution in real-time
- **Memory allocation** (var, let, const, functions)
- **Event Loop** coordination between queues
- **Microtask** vs **Macrotask** priority
- **Web APIs** handling async operations
- **Console output** synced with execution

> _"I finally get how the event loop works!"_ — Every developer after 5 minutes

<br />

## 🎯 The Experience

<table>
<tr>
<td width="50%">

### 📚 16 Curated Scenarios

From variable hoisting to promise chaining — each scenario teaches a core JavaScript concept with working code.

</td>
<td width="50%">

### 🎬 Step-by-Step Execution

Watch code execute line-by-line. See variables initialize, functions push to the call stack, and callbacks queue up.

</td>
</tr>
<tr>
<td width="50%">

### 🔄 Event Loop Phases

Visual indicators show when the engine switches between creation phase, execution phase, and event loop processing.

</td>
<td width="50%">

### ⚡ Microtask Priority

See why promises execute _before_ setTimeout — microtasks always drain before the next macrotask runs.

</td>
</tr>
<tr>
<td width="50%">

### 🧩 Call Stack Tracking

Function calls push contexts, returns pop them. Watch the stack grow and shrink with each operation.

</td>
<td width="50%">

### 📝 Live Console Output

Console logs appear exactly when they execute — no guessing about order or timing.

</td>
</tr>
</table>

<br />

## ✨ Features

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ◉ Real-time call stack visualization                      │
│   ◉ Memory panel showing vars, lets, consts, and functions  │
│   ◉ Microtask & Macrotask queue animations                  │
│   ◉ Web API tracking (setTimeout, Promises, fetch)          │
│   ◉ Line-by-line code highlighting during execution         │
│   ◉ Console output synced with actual execution order       │
│   ◉ Creation vs Execution phase indicators                  │
│   ◉ Speed control (pause, slow, normal, fast)               │
│   ◉ Step-by-step explanations for each operation            │
│   ◉ Execution logs panel with full event history            │
│   ◉ Dark theme with smooth animations                       │
│   ◉ Responsive design for all screen sizes                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

<br />

## 📖 Learning Scenarios

| #   | Scenario                   | Concepts Covered                            |
| :-- | :------------------------- | :------------------------------------------ |
| 1   | var/let/const & Hoisting   | Memory allocation, TDZ, variable hoisting   |
| 2   | Function Execution Context | Call stack, nested functions, scope         |
| 3   | Closures                   | Lexical scope, closure memory               |
| 4   | Callback Functions         | Functions as values, callback execution     |
| 5   | setTimeout (Macrotask)     | Web API, macrotask queue, event loop        |
| 6   | Promise (Microtask)        | Promise resolution, microtask queue         |
| 7   | Microtask vs Macrotask     | Priority order, queue processing            |
| 8   | Promise Chaining           | .then() chains, microtask sequencing        |
| 9   | Async/Await                | Syntactic sugar over promises               |
| 10  | Event Loop Challenge       | Complex async flow with mixed queues        |
| 11  | Multiple setTimeout        | Macrotask ordering, timer delays            |
| 12  | Mixed Promises & Timeouts  | Interleaved micro/macrotask execution       |
| 13  | Error Handling (try/catch) | Exception handling in execution flow        |
| 14  | Fetch API Simulation       | Network requests as async operations        |
| 15  | Recursive Functions        | Stack growth, base cases                    |
| 16  | Hoisting Edge Cases        | Function vs var hoisting, declaration order |

<br />

## 🛠 Built With

<div align="center">

|     | Technology        | Role                      |
| :-: | :---------------- | :------------------------ |
| ⚛️  | **React 19**      | Component Architecture    |
| 🎨  | **Tailwind CSS**  | Utility-First Styling     |
| 🎬  | **Framer Motion** | Smooth UI Animations      |
| ⚡  | **Vite**          | Lightning-Fast Dev Server |
| 🧠  | **Custom Engine** | JS Execution Simulation   |

</div>

<br />

## 🏁 Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/jsengine-eventloop.git

# Navigate to project
cd jsengine-eventloop

# Install dependencies
npm install

# Launch the visualizer
npm run dev
```

Open [localhost:5173](http://localhost:5173) and start exploring! 🚀

<br />

## 📜 Scripts

| Command           | Action                   |
| :---------------- | :----------------------- |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Check code quality       |

<br />

## 🎓 How It Works

The engine simulates JavaScript's execution model:

1. **Creation Phase**: Variables and functions are hoisted and stored in memory
2. **Execution Phase**: Code runs line-by-line, pushing/popping the call stack
3. **Event Loop**: After the call stack empties, microtasks run, then one macrotask, repeat

Each scenario is a sequence of instructions (`DECLARE_VAR`, `INITIALIZE`, `CALL_FUNCTION`, `LOG`, etc.) that the engine processes while updating the UI in real-time.

<br />

## 🤝 Contributing

Found a bug? Have an idea for a new scenario? Want to add support for generators or async iterators?

Pull requests are welcome! For major changes, please open an issue first.

<br />

## 📄 License

**MIT** — Use it, learn from it, build upon it, teach with it.

<br />

---

<div align="center">

**Made with 💙 for developers learning JavaScript internals**

_If this helped you finally understand the event loop, drop a ⭐_

</div>

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
