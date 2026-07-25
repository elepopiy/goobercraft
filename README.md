# GooberCraft

Sıfırdan, **Mineflayer kullanılmadan** yazılmış TypeScript Minecraft: Java Edition
bot kütüphanesi. Yalnızca şu paketler üzerine kuruludur:

- `minecraft-protocol`
- `prismarine-chunk`
- `prismarine-block`
- `prismarine-item`
- `prismarine-registry`
- `prismarine-nbt`
- `vec3`

## Kurulum

```bash
npm install
npm run build
```

## Hızlı başlangıç

```ts
import { createBot } from "goobercraft";

const bot = createBot({
  host: "localhost",
  port: 25565,
  username: "Goober",
  auth: "offline",
});

bot.on("spawn", () => {
  bot.chat("Merhaba!");
});
```

`createBot()` çağrıldığı anda handshake, login, configuration,
compression/encryption (minecraft-protocol tarafından), keep-alive,
teleport confirm, spawn tespiti, entity/chunk/inventory/health/food/xp
senkronizasyonu otomatik olarak başlar. Hiçbir ham paket yazmanız
gerekmez.

## Mimari

```
src/
├── index.ts            Public API export'ları
├── createBot.ts         Fabrika fonksiyonu
├── Bot.ts                Kullanıcıya açık kolay API
├── core/                 EventBus, ProtocolManager, PluginManager, BotCore
├── managers/              Her biri tek bir sorumluluğa sahip 18 manager
├── entity/                Entity / PlayerEntity modelleri
├── world/                 World cache + raycast
├── inventory/             Window / Item modelleri
├── pathfinder/            Sınırlı-alan A* pathfinder
└── utils/                 types, Logger, Vec3Utils
```

Her manager **tek bir işten** sorumludur (SOLID / Single Responsibility):
`KeepAliveManager` sadece keep-alive'a cevap verir, `TeleportManager`
sadece pozisyon senkronizasyonunu ve teleport onayını yönetir, vb.
Tüm manager'lar birbirleriyle doğrudan değil, `EventBus` üzerinden
haberleşir; bu da bağımlılıkları gevşek tutar ve test edilebilirliği
artırır.

## Özellik durumu ve bilinen sınırlar

Bu, dürüstçe belirtilmesi gereken önemli bir nokta: **Mineflayer, yıllar
içinde onlarca katkıcı tarafından geliştirilmiş, protokol versiyonlarına
göre binlerce satır edge-case barındıran bir kütüphanedir.** GooberCraft
bunun tamamını tek seferde, production kalitesinde yeniden üretmeyi
hedeflemez — bunun yerine **gerçekten çalışan bir çekirdek** sunar:

**Tam otomatik ve production'a yakın:**
- Handshake / Login / Configuration / Compression / Encryption (minecraft-protocol)
- KeepAlive, Teleport Confirm, Respawn, Spawn event
- Chat parse/send (legacy + system_chat + imzalı player_chat)
- Entity tracking (spawn/destroy/move/velocity/metadata), Player list (tab)
- Health / Food / Experience senkronizasyonu
- Envanter senkronizasyonu (window_items/set_slot), equip/toss/craft/openChest/openFurnace
- Plugin sistemi (`bot.loadPlugin`)

**Gerçek ve çalışan, ancak basitleştirilmiş:**
- **ChunkManager**: `prismarine-chunk`'ın versiyona özel loader'ını kullanır;
  ancak chunk paket formatı Minecraft sürümleri arasında (özellikle 1.18+
  section/biome paletleri) belirgin şekilde değişir. Bağlandığınız sürümde
  parse hatası alırsanız `prismarine-chunk` sürümünü/versiyon string'ini
  güncellemeniz gerekebilir.
- **PhysicsManager**: Yerçekimi, yürüme, koşma ve zıplamayı gerçekten
  simüle eder ve pozisyon paketlerini gönderir; ancak Minecraft'ın tam
  AABB çarpışma motorunu (merdiven, su, örümcek ağı, buz sürtünmesi,
  slime blok vb.) içermez.
- **SimplePathfinder**: Sınırlı bir hacimde çalışan gerçek bir A*
  algoritmasıdır; Mineflayer'ın `mineflayer-pathfinder`'ı kadar
  gelişmiş parkur/kapı/su mantığı içermez.
- **Raycast**: Amanatides-Woo voxel traversal ile gerçek blok
  raycasting yapar; entity raycasting içermez.

Bu sınırların hepsi kod içinde ilgili dosyalarda yorum olarak da
belirtilmiştir.

## API özeti

```ts
bot.chat(message)
bot.look(yaw, pitch)
bot.lookAt(vec3)
bot.swingArm()
bot.attack(entityOrId)
bot.useItem()
bot.placeBlock(referencePos, faceVec3)
bot.dig(position)
bot.move("forward" | "back" | "left" | "right" | "jump", state)
bot.jump()
bot.sneak(state)
bot.sprint(state)
bot.setControlState(control, state)
bot.stop()

bot.entities            // Entity[]
bot.players              // PlayerData[]
bot.nearestEntity(predicate?)
bot.nearestPlayer()

bot.getBlock(position)
bot.getChunk(chunkX, chunkZ)
bot.getBiome(position)
bot.raycast(maxDistance?)

bot.equip(itemName, "hand" | "off-hand")
bot.unequip()
bot.toss(itemName, amount?)
bot.craft(recipeId, craftAll?)
bot.openChest()
bot.openFurnace()

bot.loadPlugin(plugin)
```

## Lisans

MIT
