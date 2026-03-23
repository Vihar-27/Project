import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { Task, TaskStatus, Column } from './types';
import { useKanban } from './hooks/useKanban';
import { KanbanColumn } from './components/KanbanColumn';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
;

const COLUMNS: Column[] = [
  { id: 'todo', label: 'Todo', accent: '#e0e7ff', dot: '#6366f1' },
  { id: 'in-progress', label: 'In Progress', accent: '#fef3c7', dot: '#f59e0b' },
  { id: 'completed', label: 'Completed', accent: '#d1fae5', dot: '#10b981' },
];

export default function App() {
  const {
    search, setSearch, priorityFilter, setPriorityFilter,
    getColumnTasks, loadMore,
    addTask, updateTask, deleteTask, moveTask, reorderTasks,
  } = useKanban();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null | undefined>(undefined);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [darkMode, setDarkMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (e: DragStartEvent) => {
    const all = COLUMNS.flatMap(c => getColumnTasks(c.id).tasks);
    setActiveTask(all.find(t => t.id === e.active.id) ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Dropped on a column
    if (COLUMNS.some(c => c.id === overId)) {
      moveTask(activeId, overId as TaskStatus);
      return;
    }

    // Dropped on another card — same column reorder or cross-column
    const allTasks = COLUMNS.flatMap(c => getColumnTasks(c.id).tasks);
    const overTask = allTasks.find(t => t.id === overId);
    const dragged = allTasks.find(t => t.id === activeId);
    if (!overTask || !dragged) return;

    if (dragged.status !== overTask.status) {
      moveTask(activeId, overTask.status);
    } else {
      reorderTasks(activeId, overId, dragged.status);
    }
  };

  const openCreate = (status: TaskStatus) => {
    setDefaultStatus(status);
    setEditTask(null);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-mark">K</span>
            <span className="logo-text">Kanban</span>
          </div>
        </div>
        <div className="header-center">
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            className="icon-btn"
            onClick={() => setDarkMode(d => !d)}
            title="Toggle dark mode"
          >
            {darkMode ? '☀' : '◑'}
          </button>
          <button className="btn-primary" onClick={() => openCreate('todo')}>
            + New task
          </button>
        </div>
      </header>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="board">
          {COLUMNS.map(col => {
            const { tasks, total, hasMore } = getColumnTasks(col.id);
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                label={col.label}
                accent={col.accent}
                dot={col.dot}
                tasks={tasks}
                total={total}
                hasMore={hasMore}
                onLoadMore={() => loadMore(col.id)}
                onEdit={task => setEditTask(task)}
                onDelete={id => deleteTask(id)}
                onAddClick={() => openCreate(col.id)}
              />
            );
          })}
        </main>

        <DragOverlay>
          {activeTask && (
            <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      {editTask !== undefined && (
        <TaskModal
          task={editTask}
          defaultStatus={defaultStatus}
          onSave={data => editTask ? updateTask(editTask.id, data) : addTask(data)}
          onClose={() => setEditTask(undefined)}
        />
      )}
    </div>
  );
}
