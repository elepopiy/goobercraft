export interface MovementFlags {
    onGround: boolean;
    horizontalCollision?: boolean;
}
export declare function getMcData(version: string | undefined): any | null;
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
export declare function buildGroundFields(mcData: any, protodefTypeName: string, flags: MovementFlags): Record<string, unknown>;
//# sourceMappingURL=MovementPacketCompat.d.ts.map