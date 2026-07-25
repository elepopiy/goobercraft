import { Request, Response } from "express";
import { manager } from "../../managers";

export class AuthController {
  public static register(req: Request, res: Response) {
    const { username, password } = req.body;
    const result = manager.users.register(username, password);

    if (!result.success || !result.user) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.json({
      success: true,
      message: `'${result.user.username}' hesabı oluşturuldu.`,
      token: result.user.token,
      username: result.user.username,
      role: result.user.role
    });
  }

  public static login(req: Request, res: Response) {
    const { username, password } = req.body;
    const result = manager.users.login(username, password);

    if (!result.success || !result.user) {
      return res.status(401).json({ success: false, message: result.message });
    }

    return res.json({
      success: true,
      message: `Hoş geldin, ${result.user.username}.`,
      token: result.user.token,
      username: result.user.username,
      role: result.user.role
    });
  }
}