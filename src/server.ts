import express from "express";
import cors from "cors";
import path from "path";
import api from "./api/routes";

const app = express();

app.use(cors());
app.use(express.json());

// 1. PUBLIC KLAŞÖRÜNÜ STATİK DOSYA OLARAK DIŞARI AÇ
// Proje yapına göre 'public' klasörünü bağlama:
app.use(express.static(path.join(__dirname, "../public")));

// 2. API ROTALARI
app.use("/api", api);

// 3. KÖK DİZİN (/) İSTEKLERİNDE DASHBOARD'U GÖSTER
app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 4. API DURUMU KONTROLÜ İÇİN AYRI BIR ROUTE (/api/status)
app.get("/api/status", (_, res) => {
    res.json({
        name: "GooberCraft Master",
        version: "0.2.0",
        status: "online"
    });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`GooberCraft Master listening on http://localhost:${PORT}`);
});