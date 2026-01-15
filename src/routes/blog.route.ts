import { Router } from "express";
import { getBlogs, getHellos } from "../controllers/blog.controller";

const router: Router = Router();

router.get("/blogs", getBlogs);
router.get("/hellos", getHellos);

export default router;
