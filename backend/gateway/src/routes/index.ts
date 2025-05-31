import express, { Router } from "express";
import { musicProxy } from "./proxy/musicProxy";
import { authProxy } from "./proxy/authProxy";
import { userProxy } from "./proxy/userProxy";
import helpersRoute  from './helpers/index'
import { authenticateToken } from "src/middlewares/authenticateToken.middleware";

const router = Router()

router.use("/api/music", authenticateToken, musicProxy)
router.use("/api/auth", authProxy)
router.use("/api/user", authenticateToken, userProxy)
router.use("/api/helpers", express.json(), helpersRoute)

export default router