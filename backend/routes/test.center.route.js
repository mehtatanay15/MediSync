import express from "express";
import {createTestCentre,getAllTestCentres,getTestCentreById,updateTestCentre,deleteTestCentre} from "../controllers/test.centre.controller.js";

const router = express.Router()

router.post("/create", createTestCentre)
router.get("/read", getAllTestCentres)
router.get("/readById/:id", getTestCentreById)
router.put("/update/:id", updateTestCentre)
router.delete("/delete/:id", deleteTestCentre)

export default router
