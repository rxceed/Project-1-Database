import { getAllProjects, getProjectByID, alterProject, deleteAllProjects, deleteProjectByID, insertNewProject } from "../controllers";
import express from "express";

const router = express.Router();

router.route("/").get(getProjectByID).post(insertNewProject).patch(alterProject).delete(deleteProjectByID);
router.route("/all").get(getAllProjects);
router.route("/purge").delete(deleteAllProjects);

export default router;