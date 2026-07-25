import express from "express";
import cors from "cors";
import path from "path";
import api from "./api/routes";

const app = express();

app.use(cors());
app.use(express.json());

// Public klasörünü statik dosya olarak sun
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", api);

// Kök dizinde Dashboard HTML'ini gönder
app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`GooberCraft Master Server listening on http://localhost:${PORT}`);
});