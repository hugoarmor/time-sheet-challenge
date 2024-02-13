import "reflect-metadata";
import "./dependency-injection";
import express from "express";
import { buildRoutes, httpRoutes } from "./services/routing";

const routes = buildRoutes(httpRoutes);

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(routes);

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server listening at ${PORT}`));

