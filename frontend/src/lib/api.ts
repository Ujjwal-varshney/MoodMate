const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("moodmate_token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("moodmate_token");
    localStorage.removeItem("moodmate_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json();
}

// Auth
export async function apiSignup(name: string, email: string, password: string) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function apiLogin(email: string, password: string) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiMe() {
  return request("/auth/me");
}

// Entries
export async function apiGetEntries(mood?: string, search?: string, tag?: string) {
  const params = new URLSearchParams();
  if (mood && mood !== "all") params.set("mood", mood);
  if (search) params.set("search", search);
  if (tag) params.set("tag", tag);
  const q = params.toString();
  return request(`/entries${q ? `?${q}` : ""}`);
}

export async function apiCreateEntry(data: { title?: string; content: string; mood?: string; tags?: string[] }) {
  return request("/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetCalendarEntries(year: number, month: number) {
  return request(`/entries/calendar/${year}/${month}`);
}

export async function apiGetEntry(id: number) {
  return request(`/entries/${id}`);
}

export async function apiUpdateEntry(id: number, data: { title?: string; content?: string; mood?: string; tags?: string[] }) {
  return request(`/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteEntry(id: number) {
  return request(`/entries/${id}`, { method: "DELETE" });
}

// Search
export async function apiSearchEntries(query: string) {
  return request("/entries/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

// Improve
export async function apiImproveEntry(content: string) {
  return request("/entries/improve", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

// Mood trends
export async function apiGetMoodTrends(days: number = 30) {
  return request(`/stats/mood-trends?days=${days}`);
}

// Mood
export async function apiPredictMood(content: string) {
  return request("/mood/predict", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

// Chat
export async function apiChat(message: string) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

// Stats
export async function apiGetStats() {
  return request("/stats");
}

// Tags
export async function apiGetTags() {
  return request("/tags");
}

export async function apiCreateTag(name: string) {
  return request("/tags", { method: "POST", body: JSON.stringify({ name }) });
}

export async function apiDeleteTag(id: number) {
  return request(`/tags/${id}`, { method: "DELETE" });
}

export async function apiSuggestTags(content: string) {
  return request("/tags/suggest", { method: "POST", body: JSON.stringify({ content }) });
}

// Export
export async function apiExportDownload(format: "json" | "pdf", start?: string, end?: string, entryId?: number) {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let url: string;
  if (entryId) {
    url = `${API}/export/${format}/${entryId}`;
  } else {
    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    const q = params.toString();
    url = `${API}/export/${format}${q ? `?${q}` : ""}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const ext = format === "pdf" ? "pdf" : "json";
  a.download = entryId ? `moodmate_entry_${entryId}.${ext}` : `moodmate_entries.${ext}`;
  a.click();
  URL.revokeObjectURL(a.href);
}
