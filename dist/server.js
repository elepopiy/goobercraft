"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./api/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Projenin çalıştığı KÖK DİZİNİ (process.cwd()) baz alarak public klasörünü bulur
const publicPath = path_1.default.join(process.cwd(), "public");
// Public klasörünü statik servis et
app.use(express_1.default.static(publicPath));
app.use("/api", routes_1.default);
// Kök dizinde index.html gönder
app.get("/", (_, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`GooberCraft Master listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map