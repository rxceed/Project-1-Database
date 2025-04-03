import { getAllProjects, getProjectByID, insertNewGrade, alterProject, deleteAllProjects, deleteProjectByID } from "../controllers";
import express from "express";

const router = express.Router();

router.route("/").get(getProjectByID).post(insertNewGrade).patch(alterProject).delete(deleteProjectByID);
router.route("/all").get(getAllProjects);
router.route("/purge").delete(deleteAllProjects);

export default router;