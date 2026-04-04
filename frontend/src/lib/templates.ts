export interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  sections: string[];
  isCustom?: boolean;
}

export const defaultTemplates: Template[] = [
  {
    id: "gratitude",
    name: "Gratitude",
    icon: "🙏",
    description: "Focus on things you're thankful for",
    sections: [
      "3 things I'm grateful for today:",
      "1.",
      "2.",
      "3.",
      "",
      "Someone who made my day better:",
      "",
      "A small moment I want to remember:",
    ],
  },
  {
    id: "daily-reflection",
    name: "Daily Reflection",
    icon: "🌅",
    description: "Reflect on your day from start to end",
    sections: [
      "How did my day start?",
      "",
      "The highlight of my day:",
      "",
      "Something that challenged me:",
      "",
      "What I learned today:",
      "",
      "How am I feeling right now?",
    ],
  },
  {
    id: "vent-mode",
    name: "Vent Mode",
    icon: "🌊",
    description: "Let it all out — no judgment",
    sections: [
      "What's bothering me right now:",
      "",
      "How it makes me feel:",
      "",
      "What I wish was different:",
      "",
      "One thing that could help:",
    ],
  },
  {
    id: "goal-setting",
    name: "Goal Setting",
    icon: "🎯",
    description: "Plan and track your goals",
    sections: [
      "My main goal right now:",
      "",
      "Why this matters to me:",
      "",
      "Steps I can take this week:",
      "1.",
      "2.",
      "3.",
      "",
      "Potential obstacles and how I'll handle them:",
    ],
  },
  {
    id: "dream-log",
    name: "Dream Log",
    icon: "🌙",
    description: "Record and reflect on your dreams",
    sections: [
      "What I dreamed about:",
      "",
      "How the dream made me feel:",
      "",
      "Symbols or themes I noticed:",
      "",
      "Any connection to my waking life?",
    ],
  },
];

const CUSTOM_TEMPLATES_KEY = "moodmate_custom_templates";

export function getCustomTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_TEMPLATES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCustomTemplate(template: Template) {
  const templates = getCustomTemplates();
  templates.push({ ...template, isCustom: true });
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}

export function deleteCustomTemplate(id: string) {
  const templates = getCustomTemplates().filter((t) => t.id !== id);
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}

export function getAllTemplates(): Template[] {
  return [...defaultTemplates, ...getCustomTemplates()];
}

export function templateToContent(template: Template): string {
  return template.sections.join("\n");
}
