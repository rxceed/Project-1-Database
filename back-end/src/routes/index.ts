import express from "express";
import gradeRoutes from "./grade.route";
import projectRoutes from "./project.route"

const router = express.Router();

router.use("api/grades", gradeRoutes);
router.use("api/projects", projectRoutes);

export default router;