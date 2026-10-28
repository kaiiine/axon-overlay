import type { Question, Request } from './types';

type Raw = Record<string, unknown>;

const isObject = (value: unknown): value is Raw =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const text = (value: unknown): string => (value == null ? '' : String(value));

const FALLBACK_QUESTION: Question = { texte: 'Ta réponse est nécessaire.', choix: [], affirmatif: '', libre: true, si: '' };

const LEGACY_CHOICES = ['Autoriser', 'Refuser'];

function parseQuestion(raw: Raw): Question {
  return {
    texte: text(raw.texte),
    choix: Array.isArray(raw.choix) ? raw.choix.filter((choix): choix is string => typeof choix === 'string') : [],
    affirmatif: text(raw.affirmatif),
    libre: raw.libre !== false,
    si: text(raw.si),
  };
}

function legacyQuestions(message: Raw): Question[] {
  return [{ texte: text(message.raison) || 'Autoriser cette commande ?', choix: LEGACY_CHOICES, affirmatif: 'Autoriser', libre: true }];
}

function questionsOf(message: Raw, legacy: boolean): Question[] {
  if (legacy) return legacyQuestions(message);
  const parsed = Array.isArray(message.questions) ? message.questions.filter(isObject).map(parseQuestion) : [];
  if (parsed.length) return parsed;
  return [{ ...FALLBACK_QUESTION, texte: text(message.cle) || FALLBACK_QUESTION.texte }];
}

export function parseRequest(message: Raw): Request | null {
  if (typeof message.id !== 'string' && typeof message.id !== 'number') return null;
  const legacy = message.type === 'confirmation';
  return {
    id: message.id,
    genre: text(message.genre),
    apercu: text(legacy ? message.commande : message.apercu),
    questions: questionsOf(message, legacy),
    answers: [],
    legacy,
  };
}

export function mergeRequest(requests: Request[], incoming: Request): Request[] {
  const index = requests.findIndex(request => request.id === incoming.id);
  if (index < 0) return [...requests, incoming];
  const previous = requests[index];
  const sameQuestions = JSON.stringify(previous.questions) === JSON.stringify(incoming.questions);
  const merged = { ...incoming, answers: sameQuestions ? previous.answers : [] };
  return requests.map((request, position) => (position === index ? merged : request));
}

export function acceptedAnswer(question: Pick<Question, 'choix' | 'libre'>, typed: string, freeInput: boolean): string | null {
  if (!question.choix.length || freeInput) return typed;
  const exact = question.choix.find(choix => choix === typed);
  const loose = question.choix.find(choix => choix.toLowerCase() === typed.toLowerCase());
  const match = exact ?? loose;
  if (match) return match;
  return question.libre !== false ? typed : null;
}

export function skipInapplicable(questions: Question[], answers: string[]): string[] {
  const completed = [...answers];
  while (completed.length < questions.length) {
    const next = questions[completed.length];
    if (!next.si || next.si === completed[completed.length - 1]) break;
    completed.push('');
  }
  return completed;
}

export function isLocalCommand(draft: string): boolean {
  return draft.trimStart().startsWith('/');
}
