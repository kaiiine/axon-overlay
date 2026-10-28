const PATTERNS: [RegExp, string][] = [
  [/search|web|site|url|navigat|browse|fetch|arxiv|deep/, 'globe'],
  [/file|read|write|edit|diff/, 'file'],
];

export function toolIcon(name: string): string {
  const lower = name.toLowerCase();
  return PATTERNS.find(([pattern]) => pattern.test(lower))?.[1] ?? 'bolt';
}
