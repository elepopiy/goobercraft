import { createBot } from "../src/index";

const bot = createBot({
  host: "localhost",
  port: 25565,
  username: "Goober",
  auth: "offline",
  version: "1.21.11",
});

bot.on("spawn", () => {
  console.log(`Spawn oldu: ${bot.position}`);
  bot.chat("Merhaba, ben GooberCraft ile yazıldım!");
});

bot.on("chat", (message) => {
  console.log(`[SOHBET] ${message.text}`);
});

bot.on("health", ({ health, food }: { health: number; food: number }) => {
  console.log(`Can: ${health}, Açlık: ${food}`);
});

bot.on("death", () => {
  console.log("Bot öldü, otomatik respawn tetiklenecek.");
});

bot.on("end", () => {
  console.log("Bağlantı sona erdi.");
});

// Basit bir keşif döngüsü: 5 saniyede bir ileri yürü, sonra dur.
setInterval(() => {
  bot.move("forward", true);
  setTimeout(() => bot.move("forward", false), 1000);
}, 5000);
