import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskFormData } from '../types';
import { loadTasks, saveTasks } from '../utils/storage';

const PAGE_SIZE = 8;

export function useKanban() {
  const [allTasks, setAllTasks] = useState<Task[]>(() => loadTasks());
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Pages per column for infinite scroll
  const [pages, setPages] = useState<Record<TaskStatus, number>>({
    'todo': 1,
    'in-progress': 1,
    'completed': 1,
  });

  // Persist on change
  useEffect(() => {
    saveTasks(allTasks);
  }, [allTasks]);

  const filteredTasks = allTasks.filter(t => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const getColumnTasks = useCallback(
    (status: TaskStatus) => {
      const col = filteredTasks.filter(t => t.status === status);
      const limit = pages[status] * PAGE_SIZE;
      return { tasks: col.slice(0, limit), total: col.length, hasMore: col.length > limit };
    },
    [filteredTasks, pages]
  );

  const loadMore = useCallback((status: TaskStatus) => {
    setPages(prev => ({ ...prev, [status]: prev[status] + 1 }));
  }, []);

  const addTask = useCallback((data: TaskFormData) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: data.title.trim(),
      description: data.description.trim() || undefined,
      status: data.status,
      priority: data.priority,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      createdAt: now,
      updatedAt: now,
    };
    setAllTasks(prev => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, data: Partial<TaskFormData>) => {
    setAllTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              title: data.title?.trim() ?? t.title,
              description: data.description?.trim() || t.description,
              status: data.status ?? t.status,
              priority: data.priority ?? t.priority,
              tags: data.tags ? data.tags.split(',').map(x => x.trim()).filter(Boolean) : t.tags,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setAllTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    setAllTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      )
    );
  }, []);

  const reorderTasks = useCallback((activeId: string, overId: string, status: TaskStatus) => {
    setAllTasks(prev => {
      const colIds = prev
        .filter(t => t.status === status)
        .map(t => t.id);
      const from = colIds.indexOf(activeId);
      const to = colIds.indexOf(overId);
      if (from === -1 || to === -1) return prev;
      const newColIds = [...colIds];
      newColIds.splice(from, 1);
      newColIds.splice(to, 0, activeId);
      const posMap = new Map(newColIds.map((id, i) => [id, i]));
      return [...prev].sort((a, b) => {
        if (a.status !== status && b.status !== status) return 0;
        if (a.status !== status) return 1;
        if (b.status !== status) return -1;
        return (posMap.get(a.id) ?? 0) - (posMap.get(b.id) ?? 0);
      });
    });
  }, []);

  return {
    allTasks,
    filteredTasks,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    getColumnTasks,
    loadMore,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
  };
}
