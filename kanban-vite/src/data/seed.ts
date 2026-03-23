import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority } from '../types';

const titles = [
  'Design authentication flow',
  'Set up CI/CD pipeline',
  'Write unit tests for API',
  'Refactor database schema',
  'Implement dark mode',
  'Fix mobile layout issues',
  'Add email notifications',
  'Optimize image loading',
  'Update documentation',
  'Review pull requests',
  'Deploy to staging server',
  'Integrate payment gateway',
  'Build search functionality',
  'Add export to CSV feature',
  'Performance profiling',
  'Accessibility audit',
  'Code review session',
  'Fix login redirect bug',
  'Add rate limiting',
  'Create onboarding flow',
  'Build analytics dashboard',
  'Migrate to TypeScript',
  'Set up monitoring alerts',
  'Implement caching layer',
  'Redesign settings page',
  'Add multi-language support',
  'Write API documentation',
  'Fix memory leak issue',
  'Add keyboard shortcuts',
  'Implement undo/redo',
];

const descriptions = [
  'Needs thorough testing across all browsers.',
  'Follow the existing code patterns.',
  'Check with design team before starting.',
  'High priority — blocks other tasks.',
  'See Figma file for reference.',
  'Coordinate with backend team.',
  undefined,
  undefined,
  'Update Notion doc when done.',
  'Needs security review after completion.',
];

const allTags = [
  ['frontend', 'ui'],
  ['backend', 'api'],
  ['devops', 'infra'],
  ['testing'],
  ['design'],
  ['bugfix'],
  ['feature'],
  ['docs'],
  ['performance'],
  ['security'],
];

const statuses: TaskStatus[] = ['todo', 'in-progress', 'completed'];
const priorities: TaskPriority[] = ['low', 'medium', 'high'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSeedTasks(count = 60): Task[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const createdDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const updatedDate = new Date(createdDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000);
    return {
      id: uuidv4(),
      title: titles[i % titles.length],
      description: randomFrom(descriptions),
      status: randomFrom(statuses),
      priority: randomFrom(priorities),
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      tags: randomFrom(allTags),
    };
  });
}
