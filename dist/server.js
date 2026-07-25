"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const port = Number(process.env.PORT) || 3000;
const server = http_1.default.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("GooberCraft Master Server is running!");
});
server.listen(port, () => {
    console.log(`GooberCraft Master Server listening on port ${port}`);
});
//# sourceMappingURL=server.js.map