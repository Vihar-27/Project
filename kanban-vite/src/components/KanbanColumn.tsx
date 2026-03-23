import React, { useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface Props {
  id: TaskStatus;
  label: string;
  accent: string;
  dot: string;
  tasks: Task[];
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const KanbanColumn: React.FC<Props> = ({
  id, label, accent, dot, tasks, total, hasMore,
  onLoadMore, onEdit, onDelete, onAddClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  // Infinite scroll via IntersectionObserver
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasMore) return;
      observerRef.current = new IntersectionObserver(
        entries => { if (entries[0].isIntersecting) onLoadMore(); },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    },
    [hasMore, onLoadMore]
  );

  return (
    <div className={`column ${isOver ? 'column-over' : ''}`}>
      <div className="column-header">
        <div className="column-title">
          <span className="column-dot" style={{ background: dot }} />
          <span>{label}</span>
          <span className="column-count">{total}</span>
        </div>
        <button className="add-btn" onClick={onAddClick} title="Add task">+</button>
      </div>

      <div className="column-scroll" ref={setNodeRef}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="empty-col">
            <span>No tasks</span>
          </div>
        )}

        {hasMore && (
          <div ref={sentinelRef} className="load-sentinel">
            <span className="loading-dots">
              <span /><span /><span />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
