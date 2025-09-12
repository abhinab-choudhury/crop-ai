import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "",
		methods: ["GET", "POST", "OPTIONS"],
	}),
);

app.use(express.json());

app.use('/crop', require('./router/cropRotationRoute'));
app.use('/chat', require('./router/chat'));


app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
