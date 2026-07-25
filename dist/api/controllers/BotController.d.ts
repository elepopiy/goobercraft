import { Request, Response } from "express";
export declare class BotController {
    static getBots(req: Request, res: Response): void;
    static createBot(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static stopBot(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=BotController.d.ts.map