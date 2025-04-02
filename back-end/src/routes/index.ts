import express from "express";
import gradeRoutes from "./grade.route";

const router = express.Router();

router.use("/grades", gradeRoutes);

export default router;