import { getTg } from "./telegram";

// Neither method is universally reliable across Telegram client builds —
// notificationOccurred is reported broken on some, impactOccurred on others.
// Fire both independently so one working method is enough to get a vibration.
export function goalReachedHaptic(): void {
  const tg = getTg();
  try {
    tg?.HapticFeedback?.notificationOccurred("success");
  } catch {
    // no-op: haptics are a nice-to-have, never block the UI on failure
  }
  try {
    tg?.HapticFeedback?.impactOccurred("heavy");
  } catch {
    // no-op
  }
}
