import express, { Response } from "express";

const PORT = 3000;

const app = express();

app.use(express.json());

app.get("/", (_, res: Response) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
