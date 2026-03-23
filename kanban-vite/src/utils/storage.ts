import { Task } from '../types';
import { generateSeedTasks } from '../data/seed';

const STORAGE_KEY = 'kanban_tasks';

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Task[];
  } catch {}
  const seed = generateSeedTasks(60);
  saveTasks(seed);
  return seed;
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
