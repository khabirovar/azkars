export function truncateWords(text: string, wordCount = 4): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text.trim();
  return words.slice(0, wordCount).join(" ") + "…";
}
