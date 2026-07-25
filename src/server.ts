import express from "express";
import cors from "cors";
import api from "./api/routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", api);

const PORT = Number(process.env.PORT) || 3000;

app.get("/", (_, res) => {

    res.json({

        name: "GooberCraft Master",

        version: "0.2.0",

        status: "online"

    });

});

app.listen(PORT, () => {

    console.log(
        `GooberCraft Master listening on ${PORT}`
    );

});