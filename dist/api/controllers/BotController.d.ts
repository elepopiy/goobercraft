import { Request, Response } from "express";
export declare class BotController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static stop(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getBots(req: Request, res: Response): Response<any, Record<string, any>>;
}
//# sourceMappingURL=BotController.d.ts.map