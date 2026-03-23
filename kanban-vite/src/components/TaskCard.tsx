import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { formatDate } from '../utils/storage';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const priorityConfig = {
  high: { label: 'High', bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  medium: { label: 'Med', bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  low: { label: 'Low', bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
};

export const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete, isDragging }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.4 : 1,
  };

  const p = priorityConfig[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isSortDragging ? 'dragging' : ''}`}
    >
      {/* Drag handle */}
      <div className="drag-handle" {...attributes} {...listeners}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="4" cy="4" r="1.2" fill="currentColor" />
          <circle cx="10" cy="4" r="1.2" fill="currentColor" />
          <circle cx="4" cy="10" r="1.2" fill="currentColor" />
          <circle cx="10" cy="10" r="1.2" fill="currentColor" />
        </svg>
      </div>

      <div className="card-body">
        <div className="card-top">
          <span
            className="priority-badge"
            style={{ background: p.bg, color: p.color }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, display: 'inline-block', marginRight: 5 }} />
            {p.label}
          </span>
          <div style={{ position: 'relative' }}>
            <button
              className="menu-btn"
              onClick={() => setShowMenu(s => !s)}
              onBlur={() => setTimeout(() => setShowMenu(false), 150)}
            >
              ···
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={() => { onEdit(task); setShowMenu(false); }}>Edit</button>
                <button className="danger" onClick={() => { onDelete(task.id); setShowMenu(false); }}>Delete</button>
              </div>
            )}
          </div>
        </div>

        <h3 className="card-title">{task.title}</h3>

        {task.description && (
          <p className="card-desc">{task.description}</p>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="tag-list">
            {task.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <span className="card-date">{formatDate(task.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
