# Kanban Task Board

A production-grade Kanban-style task management board built with React, TypeScript, and Vite. Features drag-and-drop across columns, infinite scroll pagination, real-time search, and full localStorage persistence.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)
![dnd-kit](https://img.shields.io/badge/dnd--kit-6.1-FF4154?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## Features

- **Drag & Drop** — Drag tasks between Todo, In Progress, and Completed columns. Status and `updatedAt` timestamp update automatically on drop.
- **Infinite Scroll** — Each column independently loads 8 tasks per page using `IntersectionObserver`. Scrolling near the bottom appends more tasks without replacing existing ones.
- **Task Management** — Create, edit, and delete tasks via a modal form with title, description, status, priority, and tags.
- **Search & Filter** — Live search across task title and description. Filter by priority level (High / Medium / Low).
- **Data Persistence** — All tasks are saved to `localStorage` in JSON format. 60 realistic seed tasks are generated on first load.
- **Dark Mode** — Full dark theme toggle built into the header.
- **Priority Badges** — Visual color-coded badges for High, Medium, and Low priority tasks.
- **Tags** — Attach comma-separated tags to any task.
- **Responsive Layout** — Adapts to tablet and mobile screen sizes.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool & dev server |
| @dnd-kit/core | 6.1 | Drag-and-drop engine |
| @dnd-kit/sortable | 8.0 | Sortable lists within columns |
| uuid | 9.0 | Unique task ID generation |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (v25 supported)
- npm v7 or higher

Check your versions:
```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

> Vite uses port **5173** by default (not 3000).

### Build for Production

```bash
npm run build
```

The optimized production build will be output to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
kanban-board/
├── index.html                 # Vite entry HTML (root level)
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript config
├── tsconfig.node.json         # TypeScript config for Vite config file
├── package.json
├── src/
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces: Task, Column, TaskFormData
│   ├── data/
│   │   └── seed.ts            # Generates 60 realistic seed tasks on first load
│   ├── utils/
│   │   └── storage.ts         # localStorage read/write helpers + date formatter
│   ├── hooks/
│   │   └── useKanban.ts       # Central state management hook (tasks, filtering, pagination)
│   ├── components/
│   │   ├── KanbanColumn.tsx   # Column with droppable zone + IntersectionObserver scroll
│   │   ├── TaskCard.tsx       # Draggable task card with edit/delete actions
│   │   └── TaskModal.tsx      # Create and edit task modal form
│   ├── App.tsx                # Root component — DndContext, board layout, dark mode
│   ├── App.css                # Full design system (light + dark themes, all components)
│   └── main.tsx               # React DOM entry point
└── README.md
```

---

## Architecture & Design Decisions

### Why Vite over Create React App
Vite is the modern standard for React projects. It supports Node.js v18–v25+, starts in milliseconds via native ES modules, and has no peer dependency conflicts. CRA (`react-scripts`) is no longer maintained and has compatibility issues with Node 17+.

### State Management
All task state lives in a single custom hook `useKanban.ts`. This keeps every component stateless and focused purely on rendering. Filtering, pagination, and all CRUD operations are exposed as clean functions from the hook.

### Drag and Drop
`@dnd-kit` was chosen over `react-beautiful-dnd` because:
- Full React 18 compatibility (no StrictMode warnings)
- Better accessibility (keyboard navigation support)
- Modular — only import what you need (`core` + `sortable`)
- Actively maintained

### Infinite Scroll
Each column tracks its own page count independently in state. A sentinel `div` at the bottom of each column is observed with `IntersectionObserver`. When it enters the viewport, the page count increments and new tasks are appended — previously loaded tasks are never replaced.

### Persistence
Tasks are serialized to JSON and stored in `localStorage` on every state change via a `useEffect`. On first load, if no saved data is found, 60 realistic seed tasks are generated and saved automatically.

### Optimistic Updates
All mutations (create, update, delete, move) update React state immediately with no async loading states needed, since the data layer is synchronous `localStorage`.

---

## Task Data Model

```typescript
interface Task {
  id: string;           // UUID v4
  title: string;        // Required
  description?: string; // Optional
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags?: string[];      // Comma-separated on input
  createdAt: string;    // ISO 8601 timestamp
  updatedAt: string;    // Updates on every edit or drag
}
```

---

## Usage

| Action | How |
|---|---|
| Create a task | Click **+ New task** in the header or the **+** button on any column |
| Edit a task | Hover over a card → click **Edit** |
| Delete a task | Hover over a card → click **Del** |
| Move a task | Drag and drop the card to another column |
| Search | Type in the search bar — filters live across all columns |
| Filter by priority | Use the priority dropdown in the header |
| Load more tasks | Scroll to the bottom of any column |
| Toggle dark mode | Click the **◑** button in the header |

---

## License

MIT © 2024
