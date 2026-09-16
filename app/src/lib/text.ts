export function truncateWords(text: string, wordCount = 4): string {
  const trimmed = text.trim();
  // Arabic azkar text is wrapped in an ornate closing bracket ﴾ (U+FD3E) —
  // keep it after the ellipsis so truncation doesn't leave it dangling open.
  const closingBracket = trimmed.endsWith("﴾") ? "﴾" : "";
  const words = trimmed.split(/\s+/);
  if (words.length <= wordCount) return trimmed;
  return words.slice(0, wordCount).join(" ") + "…" + closingBracket;
}
