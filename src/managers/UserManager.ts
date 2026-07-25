import crypto from "crypto";

export type UserRole = "admin" | "user";

export interface StoredUser {
  username: string;
  passwordHash: string; // "salt:hash" formatında
  role: UserRole;
  token: string; // bot isteklerinde ownerToken olarak kullanılır
  createdAt: number;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export class UserManager {
  private readonly usersByName = new Map<string, StoredUser>();
  private readonly usersByToken = new Map<string, StoredUser>();

  constructor() {
    // "core" hesabı kullanıcıdan bağımsız, sunucu tarafından KENDİ KENDİNE oluşturulur.
    // Sabit şifre: Glory3467. Bu hesap her zaman admin'dir ve dışarıdan bu isimle
    // yeniden kayıt olunamaz (register() içinde reddedilir).
    this.createUserInternal("core", "Glory3467", "admin");
  }

  private createUserInternal(username: string, password: string, role: UserRole): StoredUser {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);

    const user: StoredUser = {
      username,
      passwordHash: `${salt}:${hash}`,
      role,
      token: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    this.usersByName.set(username.toLowerCase(), user);
    this.usersByToken.set(user.token, user);
    return user;
  }

  public register(username: string, password: string): { success: boolean; message?: string; user?: StoredUser } {
    if (!username || !password) {
      return { success: false, message: "⛔ Kullanıcı adı ve şifre zorunludur." };
    }

    const normalized = username.trim().toLowerCase();

    if (normalized === "core") {
      return { success: false, message: "⛔ 'core' rezerve edilmiş bir hesap adıdır, bu isimle kayıt olunamaz." };
    }

    if (normalized.length < 3) {
      return { success: false, message: "⛔ Kullanıcı adı en az 3 karakter olmalıdır." };
    }

    if (password.length < 6) {
      return { success: false, message: "⛔ Şifre en az 6 karakter olmalıdır." };
    }

    if (this.usersByName.has(normalized)) {
      return { success: false, message: "⛔ Bu kullanıcı adı zaten alınmış." };
    }

    // Dışarıdan oluşturulan tüm hesaplar normal kullanıcıdır — admin sadece "core"dur.
    const user = this.createUserInternal(username.trim(), password, "user");
    return { success: true, user };
  }

  public login(username: string, password: string): { success: boolean; message?: string; user?: StoredUser } {
    if (!username || !password) {
      return { success: false, message: "⛔ Kullanıcı adı ve şifre zorunludur." };
    }

    const normalized = username.trim().toLowerCase();
    const user = this.usersByName.get(normalized);

    if (!user) {
      return { success: false, message: "⛔ Kullanıcı bulunamadı." };
    }

    const [salt, storedHash] = user.passwordHash.split(":");
    const attemptHash = hashPassword(password, salt);

    const a = Buffer.from(attemptHash, "hex");
    const b = Buffer.from(storedHash, "hex");
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!match) {
      return { success: false, message: "⛔ Şifre hatalı." };
    }

    return { success: true, user };
  }

  public getByToken(token: string): StoredUser | undefined {
    return this.usersByToken.get(token);
  }

  public isAdmin(token: string): boolean {
    const user = this.getByToken(token);
    return !!user && user.role === "admin";
  }
}