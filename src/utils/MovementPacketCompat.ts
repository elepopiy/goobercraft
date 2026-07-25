import { Logger } from "./Logger";

/**
 * Minecraft'ın serverbound "Move Player" paket ailesi protokol boyunca
 * değişti:
 *
 *  - ≤1.21.1: onGround → düz `bool` alanı
 *  - ≥1.21.2: onGround + horizontalCollision → `MovementFlags` adlı
 *             ayrı bir tip (bitfield) içinde toplandı.
 *
 * Düzeltilen hata: önceki kod, resolveTypeName içinde yalnızca
 * "container" tipini işliyordu. Minecraft 1.21.2+'de MovementFlags
 * bir "bitfield" tanımı olarak gelir; bu nedenle innerFields null
 * dönüyor, flags alanı hiç eklenmiyordu ve protodef "SizeOf error
 * for undefined" fırlatıyordu.
 *
 * Çözüm:
 *  1. resolveTypeName artık bitfield tanımlarını da çözümler.
 *  2. MovementFlags için bilinen bir yedek (hardcoded fallback) eklendi;
 *     mcData'da tip bulunamazsa bile doğru alan yapısı gönderilir.
 *  3. flags alanı tespit edilip innerFields null gelirse artık düz
 *     { onGround } fallback'e DÜŞMEYİZ — flags nesnesi olarak göndeririz.
 */

type ProtodefField = { name: string; type: unknown };

export interface MovementFlags {
  onGround: boolean;
  horizontalCollision?: boolean;
}

let cachedMcData: unknown = null;
let cachedVersion: string | null = null;

export function getMcData(version: string | undefined): any | null {
  if (!version) return null;
  if (cachedMcData && cachedVersion === version) return cachedMcData;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const minecraftData = require("minecraft-data");
    cachedMcData = minecraftData(version);
    cachedVersion = version;
    return cachedMcData;
  } catch (err) {
    Logger.warn(
      "MovementPacketCompat",
      "minecraft-data yüklenemedi; hareket paketleri legacy alanlarla gönderilecek.",
      err
    );
    return null;
  }
}

/** protodef container tanımından alan listesini çıkarır: ["container", [...]] */
function containerFields(def: unknown): ProtodefField[] | null {
  if (Array.isArray(def) && def[0] === "container" && Array.isArray(def[1])) {
    return def[1] as ProtodefField[];
  }
  return null;
}

/**
 * Bir protodef tip tanımından alan listesini çıkarır.
 * container ve bitfield formatlarının ikisini de destekler.
 */
function fieldsFromDef(def: unknown): ProtodefField[] | null {
  if (!Array.isArray(def)) return null;

  // container: ["container", [{name, type}, ...]]
  const asContainer = containerFields(def);
  if (asContainer) return asContainer;

  // bitfield: ["bitfield", [{name, size, signed}, ...]]
  if (def[0] === "bitfield" && Array.isArray(def[1])) {
    return (def[1] as any[]).map((b: any) => ({
      name: b.name as string,
      type: "bool",
    }));
  }

  return null;
}

/**
 * Verilen tip adı için alan listesini döner.
 * Önce play.toServer.types'a, sonra global protocol.types'a bakar.
 * container ve bitfield formatlarının ikisini de işler.
 */
function resolveTypeName(mcData: any, typeName: string): ProtodefField[] | null {
  try {
    const toServerTypes = mcData?.protocol?.play?.toServer?.types;
    if (toServerTypes?.[typeName]) {
      const result = fieldsFromDef(toServerTypes[typeName]);
      if (result) return result;
    }

    // Global tipler (bazı sürümlerde MovementFlags burada tanımlı)
    const globalTypes = mcData?.protocol?.types;
    if (globalTypes?.[typeName]) {
      const result = fieldsFromDef(globalTypes[typeName]);
      if (result) return result;
    }
  } catch {
    // yoksay
  }
  return null;
}

/** packet_position / packet_look gibi protodef paket tipinin alanlarını döner. */
function findPacketFields(mcData: any, protodefTypeName: string): ProtodefField[] | null {
  try {
    const types = mcData?.protocol?.play?.toServer?.types;
    return containerFields(types?.[protodefTypeName]);
  } catch {
    return null;
  }
}

function fieldTypeName(type: unknown): string | null {
  if (typeof type === "string") return type;
  if (Array.isArray(type) && typeof type[0] === "string") return type[0];
  return null;
}

/**
 * Bilinen named type'lar için hardcoded alan listesi.
 * mcData'dan çözümlenemezse bu yedek kullanılır.
 *
 * MC 1.21.2+ MovementFlags: onGround + horizontalCollision bitfield.
 */
const KNOWN_FLAG_TYPES: Record<string, ProtodefField[]> = {
  MovementFlags: [
    { name: "onGround", type: "bool" },
    { name: "horizontalCollision", type: "bool" },
  ],
};

/**
 * flags iç alanlarından doğru nested nesneyi üretir.
 */
function buildFlagsObject(innerFields: ProtodefField[], flags: MovementFlags): Record<string, unknown> {
  const nested: Record<string, unknown> = {};
  for (const sub of innerFields) {
    if (/ground/i.test(sub.name)) nested[sub.name] = flags.onGround;
    else if (/collision/i.test(sub.name)) nested[sub.name] = flags.horizontalCollision ?? false;
    else nested[sub.name] = false;
  }
  return nested;
}

/**
 * Doğru onGround / flags nesnesini üretir.
 *
 * Strateji:
 *  1. Packet alanları listesi alınamıyorsa → legacy { onGround } fallback.
 *  2. "bool" tipinde ve adında "ground" geçen alan bulunursa → eski format.
 *  3. Adında "flag" geçen alan bulunursa:
 *     a) Tipi inline array (container/bitfield) ise → fieldsFromDef ile çöz.
 *     b) Tipi named string ise:
 *        i.  mcData'dan çöz (resolveTypeName — artık bitfield'ı da destekler).
 *        ii. Bulunamazsa KNOWN_FLAG_TYPES'tan al.
 *     c) innerFields hâlâ null ise → flags: {} ile güvenli fallback gönder
 *        (eski { onGround } yerine — bu protodef'in flags alanını undefined
 *        görmesini önler).
 *  4. Hiçbiri uymadıysa → legacy { onGround } fallback.
 */
export function buildGroundFields(
  mcData: any,
  protodefTypeName: string,
  flags: MovementFlags
): Record<string, unknown> {
  const fields = mcData ? findPacketFields(mcData, protodefTypeName) : null;
  if (!fields) return { onGround: flags.onGround };

  for (const field of fields) {
    const typeName = fieldTypeName(field.type);

    // ── Eski format (≤1.21.1): düz boolean ──────────────────────────────
    if (typeName === "bool" && /ground/i.test(field.name)) {
      return { [field.name]: flags.onGround };
    }

    // ── Yeni format (≥1.21.2): flags alanı ──────────────────────────────
    if (/flag/i.test(field.name)) {
      let innerFields: ProtodefField[] | null = null;

      // (a) Inline container veya bitfield
      if (Array.isArray(field.type)) {
        innerFields = fieldsFromDef(field.type);
      }

      // (b) Named type — önce mcData'da ara, sonra bilinen yedeklere bak
      if (!innerFields && typeof typeName === "string") {
        innerFields = resolveTypeName(mcData, typeName);
      }

      // (c) Hardcoded fallback for known named types (e.g. "MovementFlags")
      if (!innerFields && typeof typeName === "string" && KNOWN_FLAG_TYPES[typeName]) {
        innerFields = KNOWN_FLAG_TYPES[typeName];
      }

      if (innerFields) {
        return { [field.name]: buildFlagsObject(innerFields, flags) };
      }

      // (d) flags alanı var ama yapısı çözülemedi — en azından boş nesne
      // gönder; düz { onGround } fallback'e DÜŞME (protodef undefined görür).
      Logger.warn(
        "MovementPacketCompat",
        `'${field.name}' flags alanı çözümlenemedi (tip: ${typeName}); ` +
          "güvenli fallback gönderiliyor.",
      );
      return {
        [field.name]: {
          onGround: flags.onGround,
          horizontalCollision: flags.horizontalCollision ?? false,
        },
      };
    }
  }

  // ── Fallback ─────────────────────────────────────────────────────────
  return { onGround: flags.onGround };
}
