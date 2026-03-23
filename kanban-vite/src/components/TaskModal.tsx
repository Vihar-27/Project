import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '../types';

interface Props {
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onSave: (data: TaskFormData) => void;
  onClose: () => void;
}

export const TaskModal: React.FC<Props> = ({ task, defaultStatus = 'todo', onSave, onClose }) => {
  const [form, setForm] = useState<TaskFormData>({
    title: '',
    description: '',
    status: defaultStatus,
    priority: 'medium',
    tags: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        tags: task.tags?.join(', ') || '',
      });
    }
  }, [task]);

  const handleSubmit = () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    onSave(form);
    onClose();
  };

  const set = (field: keyof TaskFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (field === 'title') setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit task' : 'New task'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="Task title"
              autoFocus
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Optional description…"
              rows={3}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select value={form.priority} onChange={set('priority')}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Tags <span className="hint">(comma-separated)</span></label>
            <input
              type="text"
              value={form.tags}
              onChange={set('tags')}
              placeholder="frontend, api, bugfix"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {task ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </div>
    </div>
  );
};
