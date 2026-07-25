export type UserRole = "admin" | "user";
export interface StoredUser {
    username: string;
    passwordHash: string;
    role: UserRole;
    token: string;
    createdAt: number;
}
export declare class UserManager {
    private readonly usersByName;
    private readonly usersByToken;
    constructor();
    private createUserInternal;
    register(username: string, password: string): {
        success: boolean;
        message?: string;
        user?: StoredUser;
    };
    login(username: string, password: string): {
        success: boolean;
        message?: string;
        user?: StoredUser;
    };
    getByToken(token: string): StoredUser | undefined;
    isAdmin(token: string): boolean;
}
//# sourceMappingURL=UserManager.d.ts.map