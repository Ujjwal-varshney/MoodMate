const API = "http://localhost:8000/api";

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
export async function apiGetEntries(mood?: string, search?: string) {
  const params = new URLSearchParams();
  if (mood && mood !== "all") params.set("mood", mood);
  if (search) params.set("search", search);
  const q = params.toString();
  return request(`/entries${q ? `?${q}` : ""}`);
}

export async function apiCreateEntry(data: { title?: string; content: string; mood?: string }) {
  return request("/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetCalendarEntries(year: number, month: number) {
  return request(`/entries/calendar/${year}/${month}`);
}

export async function apiDeleteEntry(id: number) {
  return request(`/entries/${id}`, { method: "DELETE" });
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
