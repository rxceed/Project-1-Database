import express from "express";
import gradeRoutes from "./grade.route";
import projectRoutes from "./project.route"
import dbRoutes from "./db.route";
import chapterRoutes from "./chapter.route";
import gradingParamRoutes from "./gradingParameters.route";

const router = express.Router();

router.use("/api/db", dbRoutes);
router.use("/api/grades", gradeRoutes);
router.use("/api/projects", projectRoutes);
router.use("/api/chapters", chapterRoutes);
router.use("/api/grading_parameters", gradingParamRoutes);

export default router;