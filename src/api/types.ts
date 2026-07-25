export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface WorkerRegisterRequest {
    id: string;
    name: string;
    maxBots: number;
}

export interface CreateBotRequest {
    host: string;
    port?: number;
    username: string;
    password?: string;
    version?: string;
}