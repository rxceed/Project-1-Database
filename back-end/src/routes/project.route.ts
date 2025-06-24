import { getAllProjects, getProjectByID, alterProject, deleteAllProjects, deleteProjectByID, insertNewProject, syncProject } from "../controllers";
import express from "express";

const router = express.Router();

router.route("/").get(getProjectByID).post(insertNewProject).patch(alterProject).delete(deleteProjectByID);
router.route("/all").get(getAllProjects);
router.route("/purge").delete(deleteAllProjects);
router.route("/sync").patch(syncProject);

export default router;