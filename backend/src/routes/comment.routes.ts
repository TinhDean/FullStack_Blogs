import express from "express"
import { createComment, getComments } from "../controllers/comment.controller"
import authMiddleware from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/", authMiddleware, createComment)

router.get("/:blogId", getComments)

export default router