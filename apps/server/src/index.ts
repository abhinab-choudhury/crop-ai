import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { auth } from "@/lib/auth";
import env from "@/lib/env";
import { requireAuth } from "@/middleware/auth.middleware";
import chatRouter from "@/router/chat.route";

const app = express();
const __fileaname = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileaname);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/", (req, res) => {
  const { error } = req.query;

  if (error) {
    return res.status(400).render("verify-failed");
  }
  return res.status(200).render("index");
});

app.get("/health", (_req, res) =>
  res.status(200).json({ message: "Express.js | REST API" }),
);
app.get("/verify-success", (_req, res) =>
  res.status(200).render("verify-success"),
);
app.get("/api/chat", requireAuth, chatRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
