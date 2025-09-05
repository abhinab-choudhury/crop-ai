import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { auth } from "@/lib/auth";
import env from "@/lib/env";
import { requireAuth } from "@/middleware/auth.middleware";
import chatRouter from "@/router/chat.route";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/", (_req, res) =>
	res.status(200).json({ message: "Express.js | REST API" }),
);
app.post("/", requireAuth, (_req, res) =>
	res.status(200).json({ message: "Express.js | REST API" }),
);
app.get("/api/chat", requireAuth, chatRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
