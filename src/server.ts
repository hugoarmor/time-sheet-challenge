import "reflect-metadata";
import "./dependency-injection";
import express from "express";
import { router } from "./routes/post.batidas";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(router);

app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
