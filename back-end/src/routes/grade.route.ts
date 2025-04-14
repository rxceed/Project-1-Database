import {alterGrade, deleteAllGrades, deleteGrade, getAllGrades, getGradeByGradeChar, insertNewGrade} from "../controllers";
import express from "express";

const router = express.Router();

router.route("/").get(getGradeByGradeChar).post(insertNewGrade).patch(alterGrade).delete(deleteGrade);
router.route("/all").get(getAllGrades);
router.route("/purge").delete(deleteAllGrades);


export default router