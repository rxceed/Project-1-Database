import express from "express";
import gradeRoutes from "./grade.route";
import projectRoutes from "./project.route"
import dbRoutes from "./db.route";
import chapterRoutes from "./chapter.route";

const router = express.Router();

router.use("/api/db", dbRoutes);
router.use("/api/grades", gradeRoutes);
router.use("/api/projects", projectRoutes);
router.use("/api/chapters", chapterRoutes);

export default router;