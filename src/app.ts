import express, { Application, Request, Response } from "express";
import cors from "cors";
import { booksRoutes } from "./app/controllers/book.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";
const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://library-management-system-nine-blue.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Library Management API",
  });
});

export default app;
