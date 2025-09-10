import express from "express";
import {
  chatController,
  deleteChatController,
  deleteChatHistoryController,
  getChatHistoryListController,
} from "@/controller/chat.controller";
import { requireAuth } from "@/middleware/auth.middleware";

const chatRouter = express.Router();

chatRouter.post("/", requireAuth, chatController);
chatRouter.delete("/:chatId", requireAuth, deleteChatController);
chatRouter.get("/history", requireAuth, getChatHistoryListController);
chatRouter.delete("/history/:chatId", requireAuth, deleteChatHistoryController);

export default chatRouter;
