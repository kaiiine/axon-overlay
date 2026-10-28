import type { Question } from './types';

export const AUTRE = 'Autre (préciser)';

const GENRES_FERMES = ['autorisation', 'plan', 'diff', 'envoi'];

const normaliser = (choix: string) => choix.trim().toLowerCase().replace(/\.$/, '');

export function choicesFor(question: Question | undefined, genre = ''): string[] {
  if (!question?.choix.length) return [];
  const accepteAutre = question.libre !== false && !GENRES_FERMES.includes(genre);
  if (!accepteAutre) return [...question.choix];
  return [...question.choix.filter(choix => normaliser(choix) !== normaliser(AUTRE)), AUTRE];
}

export function nextIndex(current: number, key: string, count: number): number {
  if (!count) return -1;
  if (key === 'ArrowDown' || key === 'ArrowRight') return (current + 1) % count;
  if (key === 'ArrowUp' || key === 'ArrowLeft') return (current - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return current;
}

export function indexFromDigit(key: string, count: number): number {
  if (!/^[1-9]$/.test(key)) return -1;
  const index = Number(key) - 1;
  return index < count ? index : -1;
}

export function defaultIndex(choices: string[], affirmatif?: string): number {
  const index = affirmatif ? choices.indexOf(affirmatif) : -1;
  return index < 0 ? 0 : index;
}
