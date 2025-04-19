import { getAllGradingParams, getGradingParamsByID_andOr_ChapterID, insertGradingParam, alterGradingParam, deleteAllGradingParamsByChapterID,
    deleteGradingparamByID
 } from "../controllers";
import express from "express";

const router = express.Router();

router.route("/").get(getGradingParamsByID_andOr_ChapterID).post(insertGradingParam).patch(alterGradingParam).delete(deleteGradingparamByID);
router.route("/all").get(getAllGradingParams);
router.route("/purge").delete(deleteAllGradingParamsByChapterID);

export default router;
