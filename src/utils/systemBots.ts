export interface SystemBot {
  id: string;
  nodeId: string;
  username: string;
  host: string;
  ownerToken: string;
  isSystem: true;
}

const SYSTEM_BOT_RATIO = 0.1;

export function getSystemBotCount(maxBots: number): number {
  return Math.floor((maxBots || 0) * SYSTEM_BOT_RATIO);
}

export function isSystemBotId(id: string): boolean {
  return typeof id === "string" && id.startsWith("sys_");
}

// Deterministic - aynı node her zaman aynı sistem botlarını üretir, rastgelelik yok
export function getSystemBotsForNode(node: { id: string; maxBots: number }): SystemBot[] {
  const count = getSystemBotCount(node.maxBots);
  const bots: SystemBot[] = [];
  for (let i = 0; i < count; i++) {
    bots.push({
      id: `sys_${node.id}_${i}`,
      nodeId: node.id,
      username: `SYS-Guardian-${String(i + 1).padStart(2, "0")}`,
      host: "internal.system",
      ownerToken: "SYSTEM",
      isSystem: true
    });
  }
  return bots;
}