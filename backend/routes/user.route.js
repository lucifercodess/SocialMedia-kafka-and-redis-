import express from "express";
import { follow, getFollowersList, getFollowingList, unfollow } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/follow/:id',protectRoute,follow)
router.post('/unfollow/:id',protectRoute,unfollow)
router.get('/following',protectRoute,getFollowingList);
router.get('/followers',protectRoute,getFollowersList);

export default router;