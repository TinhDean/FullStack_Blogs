import express from "express"
import { createComment, getComments, deleteComment } from "../controllers/comment.controller"
import authMiddleware from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/", authMiddleware, createComment)
router.get("/:blogId", getComments)
router.delete("/:id", authMiddleware, deleteComment)

export default router