import express from "express";

const app = express();

app.get("/", (_, res) => {
    res.send("GooberCraft Master Server Online");
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
    console.log(`GooberCraft running on ${port}`);
});