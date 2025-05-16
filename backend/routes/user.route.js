import express from "express";
import userController from "../controllers/user.controller.js";
import {auth} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register",userController.register);
router.post("/login",userController.login);
router.post("/sendOTP", userController.sendOTP);
router.post("/verifyOTP", userController.verifyOTP);
router.post("/resetPassword", userController.resetPassword);
router.post("/changePassword", userController.changePassword);
router.put("/", auth(["Patient","Doctor","Clinic"]),userController.updateAccount);
router.delete("/", auth(["Patient","Doctor","Clinic"]), userController.deleteAccount);

export default router;
