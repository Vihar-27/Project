# Kanban Task Board

A production-grade Kanban-style task management board built with **React 18**, **TypeScript 5**, and **Vite 5**. Supports drag-and-drop task movement, infinite scroll pagination per column, real-time search and filtering, dark mode, and full `localStorage` persistence.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)
![dnd-kit](https://img.shields.io/badge/@dnd--kit-6.1-FF4154?style=flat)
![Node](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Task Data Model](#task-data-model)
- [Available Scripts](#available-scripts)
- [Usage Guide](#usage-guide)
- [Known Issues](#known-issues)

---

## Features

| Feature | Description |
|---|---|
| **Drag & Drop** | Drag cards between Todo, In Progress, and Completed columns. Status and `updatedAt` update on drop. |
| **Reorder Within Column** | Drag cards up or down within the same column to reorder them. |
| **Infinite Scroll** | Each column independently paginates — 8 tasks per page via `IntersectionObserver`. New tasks append without replacing existing ones. |
| **Create Tasks** | Modal form with title, description, status, priority, and tags. |
| **Edit Tasks** | Update any field on an existing task via the same modal. |
| **Delete Tasks** | Remove tasks with a single click from the card action menu. |
| **Live Search** | Instantly filters tasks across all columns by title or description. |
| **Priority Filter** | Dropdown to filter all columns by High, Medium, or Low priority. |
| **Dark Mode** | Full dark theme toggle — persists for the session. |
| **localStorage Persistence** | All tasks saved automatically on every change. 60 seed tasks generated on first load. |
| **Priority Badges** | Color-coded badges: 🔴 High, 🟡 Medium, 🟢 Low. |
| **Tags** | Attach multiple comma-separated tags to any task. |
| **Drag Overlay** | A floating card preview (slightly rotated) follows your cursor while dragging. |
| **Responsive Layout** | Columns scroll horizontally on smaller screens. |

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | DOM renderer |
| `typescript` | ^5.0.0 | Static typing |
| `vite` | ^5.0.0 | Build tool & dev server |
| `@vitejs/plugin-react` | ^4.2.0 | Vite plugin for React/JSX |
| `@dnd-kit/core` | ^6.1.0 | Drag-and-drop engine |
| `@dnd-kit/sortable` | ^8.0.0 | Sortable context for within-column reorder |
| `@dnd-kit/utilities` | ^3.2.2 | CSS transform utilities for drag |
| `uuid` | ^9.0.0 | UUID v4 task ID generation |

---

## Getting Started

### Prerequisites

- **Node.js v18 or higher** (v25 supported — no compatibility issues)
- **npm v7 or higher**

Verify your versions:

```bash
node -v
npm -v
```

### Installation & Setup

**1. Clone the repository**

```bash
git clone https://github.com/your-username/kanban-board.git
cd kanban-board
```

**2. Install dependencies**

```bash
npm install
```

No special flags needed. Vite is compatible with all modern Node versions.

**3. Start the development server**

```bash
npm start
```

**4. Open in browser**

```
http://localhost:5173
```

> Vite uses port **5173** by default, not 3000.

---

## Project Structure

```
kanban-board/
│
├── index.html                    # App entry HTML (root level — Vite convention)
├── vite.config.ts                # Vite configuration with React plugin
├── tsconfig.json                 # TypeScript config for src/
├── tsconfig.node.json            # TypeScript config for vite.config.ts
├── package.json
├── README.md
│
└── src/
    ├── main.tsx                  # ReactDOM.createRoot entry point
    ├── App.tsx                   # Root component — DndContext, board layout, dark mode
    ├── App.css                   # Complete design system (tokens, layout, components, dark mode)
    │
    ├── types/
    │   └── index.ts              # All TypeScript interfaces: Task, Column, TaskFormData, etc.
    │
    ├── data/
    │   └── seed.ts               # Generates 60 realistic seed tasks on first load
    │
    ├── utils/
    │   └── storage.ts            # localStorage load/save helpers + date formatter
    │
    ├── hooks/
    │   └── useKanban.ts          # Central state hook — all task logic in one place
    │
    └── components/
        ├── KanbanColumn.tsx      # Droppable column with IntersectionObserver scroll
        ├── TaskCard.tsx          # Draggable/sortable card with edit & delete actions
        └── TaskModal.tsx         # Create and edit task modal form
```

---

## Architecture & Design Decisions

### Why Vite instead of Create React App

`create-react-app` (`react-scripts`) is no longer maintained and breaks on Node 17+. Vite is the modern standard — it starts instantly via native ES modules, supports all Node versions from v18 to v25+, and has no peer dependency conflicts.

### Single Custom Hook for All State

All task logic lives in `useKanban.ts` — a single custom hook that owns:

- The full task list (`allTasks`)
- Search and priority filter state
- Per-column pagination (`pages`)
- All CRUD operations: `addTask`, `updateTask`, `deleteTask`
- Drag operations: `moveTask` (cross-column), `reorderTasks` (within-column)

This keeps every component purely presentational. Components only receive data and callbacks — they never manage business logic themselves.

### Drag and Drop with @dnd-kit

`@dnd-kit` was chosen over `react-beautiful-dnd` for these reasons:

- **React 18 compatible** — no StrictMode warnings or double-render issues
- **Modular** — only `core` + `sortable` are imported, keeping the bundle small
- **Accessible** — built-in keyboard navigation support
- **Actively maintained** — unlike `react-beautiful-dnd` which is abandoned

The `PointerSensor` is configured with an activation distance of 5px to avoid accidental drags when clicking edit/delete buttons.

### Infinite Scroll Per Column

Each column independently tracks its own page count in a `Record<TaskStatus, number>` object. A sentinel `<div>` at the bottom of each column is observed with `IntersectionObserver`. When it enters the viewport, `loadMore(columnId)` is called — incrementing only that column's page. This means scrolling one column never affects the others.

### Data Persistence

A `useEffect` watches `allTasks` and calls `saveTasks()` (JSON → `localStorage`) on every change. On mount, `loadTasks()` reads from storage. If nothing is found (first visit), `generateSeedTasks(60)` creates realistic sample data and saves it immediately.

### Optimistic Updates

All mutations (create, update, delete, drag) update React state synchronously. No loading spinners or async handling are needed because `localStorage` is a synchronous API.

### CSS Design System

All styles live in `App.css` using CSS custom properties (variables). The design uses two palettes:

- **Light mode** — warm off-white (`#f5f4f0`) background with clean white card surfaces
- **Dark mode** — near-black (`#111110`) with dark surfaces

Toggling dark mode adds/removes the `.dark` class on the root `<div>`, which overrides all CSS variables in one block.

---

## Task Data Model

```typescript
interface Task {
  id: string;            // UUID v4 — generated by the uuid package
  title: string;         // Required — validated in the modal form
  description?: string;  // Optional free-text description
  status: TaskStatus;    // 'todo' | 'in-progress' | 'completed'
  priority: TaskPriority;// 'low' | 'medium' | 'high'
  tags?: string[];       // Parsed from comma-separated input string
  createdAt: string;     // ISO 8601 — set once on creation
  updatedAt: string;     // ISO 8601 — updated on every edit or drag
}
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Start dev server | `npm start` | Runs Vite dev server at http://localhost:5173 |
| Start dev server | `npm run dev` | Alias for `npm start` |
| Build for production | `npm run build` | Type-checks then bundles to `dist/` |
| Preview production | `npm run preview` | Serves the `dist/` build locally |

---

## Usage Guide

| Action | How to do it |
|---|---|
| Create a task | Click **+ New task** in the header, or the **+** button on any column |
| Edit a task | Hover over a card → click **Edit** |
| Delete a task | Hover over a card → click **Del** |
| Move a task to another column | Click and drag the card to the target column |
| Reorder within a column | Drag a card up or down within the same column |
| Search tasks | Type in the search bar — all columns filter live |
| Filter by priority | Use the priority dropdown in the header |
| Load more tasks | Scroll to the bottom of any column |
| Toggle dark mode | Click the **◑** button in the header |

---

## Known Issues

- Task data is stored in the **browser's `localStorage`** only — it is not synced across devices, users, or browsers.
- If `localStorage` is cleared (e.g. browser privacy settings), all tasks reset to the 60 seed tasks on next load.

---

## License

MIT © 2024
