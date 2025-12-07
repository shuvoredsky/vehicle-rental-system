import express, { Request, Response } from "express"
import { pool } from "../../config/db";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
const router = express.Router()


router.get("/", auth("admin"),userController.getUser)   


router.put("/:userId", auth("admin", "customer"),userController.updateUser)

router.delete("/:userId", auth("admin"),userController.deleteUser)
export const userRoute = router;