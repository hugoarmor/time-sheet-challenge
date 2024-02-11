import express from "express";
import { router } from "./routes/post.batidas";
import { errorHandler } from "./middlewares/error-handler";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
