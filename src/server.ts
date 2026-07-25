import express from "express";
import cors from "cors";
import path from "path";
import api from "./api/routes";

const app = express();

app.use(cors());
app.use(express.json());

// Projenin çalıştığı KÖK DİZİNİ (process.cwd()) baz alarak public klasörünü bulur
const publicPath = path.join(process.cwd(), "public");

// Public klasörünü statik servis et
app.use(express.static(publicPath));

app.use("/api", api);

// Kök dizinde index.html gönder
app.get("/", (_, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`GooberCraft Master listening on port ${PORT}`);
});