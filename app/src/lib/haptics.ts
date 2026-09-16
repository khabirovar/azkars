import { getTg } from "./telegram";

// notificationOccurred is preferred over impactOccurred: the latter is reported
// broken on some Telegram-for-Android builds, while notificationOccurred still
// works there.
export function goalReachedHaptic(): void {
  try {
    getTg()?.HapticFeedback?.notificationOccurred("success");
  } catch {
    // no-op: haptics are a nice-to-have, never block the UI on failure
  }
}
