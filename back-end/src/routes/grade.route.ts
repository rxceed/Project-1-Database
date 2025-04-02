import {alterGrade, deleteAllGrades, deleteGrade, getAllGrades, insertNewGrade} from "../controllers";
import express from "express";

const router = express.Router();

router.route("/").get(getAllGrades).post(insertNewGrade).patch(alterGrade).delete(deleteGrade);
router.route("/purge").delete(deleteAllGrades);


export default router