import type { Session } from './types';

export function parseSession(message: Record<string, unknown>): Session | null {
  if (typeof message.backend !== 'string' || typeof message.modele !== 'string') return null;
  const temperature = typeof message.temperature === 'number' ? message.temperature : 0;
  return { backend: message.backend, modele: message.modele, temperature };
}

export function describeSessionChange(previous: Session | null, next: Session): string[] {
  if (!previous) return [];
  const notes: string[] = [];
  if (previous.backend !== next.backend) notes.push(`Backend : ${previous.backend} → ${next.backend}`);
  if (previous.modele !== next.modele) notes.push(`Modèle : ${next.modele}`);
  if (previous.temperature !== next.temperature) notes.push(`Température : ${next.temperature}`);
  return notes;
}
