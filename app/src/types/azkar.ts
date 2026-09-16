export type TimeOfDay = "morning" | "evening" | "after-prayer";

export interface AzkarEntry {
  id: string;
  timeOfDay: TimeOfDay;
  order: number;
  arabicText: string;
  transliterationRu: string;
  translationRu: string;
  targetCount: number;
  sourceRu: string | null;
  audioUrl: string | null;
}
