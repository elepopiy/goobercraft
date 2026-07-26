import { BotProfile } from "./types";

export type BotProfileAction =
  | { type: "combat" }
  | { type: "build"; detail: string }
  | { type: "chat"; detail: string }
  | { type: "stable" };

export function normalizeBotProfile(profile?: string | BotProfile): BotProfile {
  switch ((profile ?? "stable").toLowerCase()) {
    case "combat":
      return "combat";
    case "builder":
      return "builder";
    case "chatter":
      return "chatter";
    case "stable":
      return "stable";
    default:
      return "stable";
  }
}

export function parseBotProfileAction(profile: string | BotProfile | undefined, message: string): BotProfileAction {
  const normalized = normalizeBotProfile(profile);

  if (normalized === "combat") {
    return { type: "combat" };
  }

  if (normalized === "builder") {
    const trimmed = message.trim();
    if (trimmed.startsWith("!yap")) {
      const detail = trimmed.slice(4).trim() || "kule";
      return { type: "build", detail };
    }
    return { type: "stable" };
  }

  if (normalized === "chatter") {
    const trimmed = message.trim();
    if (trimmed.startsWith("!sor")) {
      const detail = trimmed.slice(4).trim() || "merhaba";
      return { type: "chat", detail };
    }
    return { type: "stable" };
  }

  return { type: "stable" };
}
