import { Router } from "express";
const router = Router();

import { create, 
        findAll, 
        topNews, 
        findById, 
        searchByTitle, 
        findByUser, 
        update,
        deleteNews,
        likeNews,
        commentNews,
        deleteComment } from "../controllers/news.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";

router.post("/create", authMiddleWare, create);

router.get("/", findAll);
router.get("/top", topNews);
router.get("/title", searchByTitle);
router.get("/byUser", authMiddleWare, findByUser);
router.get("/:id", authMiddleWare, findById);

router.patch("/:id", authMiddleWare, update);
router.patch("/like/:id", authMiddleWare, likeNews);
router.patch("/comment/:id", authMiddleWare, commentNews);
router.patch("/comment/:newsId/:commentId", authMiddleWare, deleteComment);

router.delete("/:id", authMiddleWare, deleteNews);

export default router;