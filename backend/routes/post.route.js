import express from "express";
import { createPost, deletePost, editPost, likeUnlikePost, viewPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";


const router = express.Router();

router.post('/create',protectRoute,createPost)
router.post('/edit/:id',protectRoute,editPost)
router.delete('/delete/:id',protectRoute,deletePost)
router.get('/posts/',protectRoute,viewPosts)
router.post('/posts/like-unlike',protectRoute,likeUnlikePost)


export default router;
