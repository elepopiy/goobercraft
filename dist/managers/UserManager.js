"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const crypto_1 = __importDefault(require("crypto"));
function hashPassword(password, salt) {
    return crypto_1.default.scryptSync(password, salt, 64).toString("hex");
}
class UserManager {
    usersByName = new Map();
    usersByToken = new Map();
    constructor() {
        // "core" hesabı kullanıcıdan bağımsız, sunucu tarafından KENDİ KENDİNE oluşturulur.
        // Sabit şifre: Glory3467. Bu hesap her zaman admin'dir ve dışarıdan bu isimle
        // yeniden kayıt olunamaz (register() içinde reddedilir).
        this.createUserInternal("core", "Glory3467", "admin");
    }
    createUserInternal(username, password, role) {
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        const hash = hashPassword(password, salt);
        const user = {
            username,
            passwordHash: `${salt}:${hash}`,
            role,
            token: crypto_1.default.randomUUID(),
            createdAt: Date.now(),
        };
        this.usersByName.set(username.toLowerCase(), user);
        this.usersByToken.set(user.token, user);
        return user;
    }
    register(username, password) {
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
    login(username, password) {
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
        const match = a.length === b.length && crypto_1.default.timingSafeEqual(a, b);
        if (!match) {
            return { success: false, message: "⛔ Şifre hatalı." };
        }
        return { success: true, user };
    }
    getByToken(token) {
        return this.usersByToken.get(token);
    }
    isAdmin(token) {
        const user = this.getByToken(token);
        return !!user && user.role === "admin";
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=UserManager.js.map