import express from "express";
import { login, logout, register, resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.post('/resetPassword',protectRoute,resetPassword);
export default router;