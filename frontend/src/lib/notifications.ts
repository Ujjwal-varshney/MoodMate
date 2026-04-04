const REMINDER_KEY = "moodmate_reminder_enabled";

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendReminder() {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;
  new Notification("MoodMate Reminder", {
    body: "You haven't journaled today. Take a moment to reflect on your day!",
    icon: "/favicon.ico",
  });
}

export function isReminderEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REMINDER_KEY) === "true";
}

export function setReminderEnabled(enabled: boolean) {
  localStorage.setItem(REMINDER_KEY, enabled ? "true" : "false");
}
