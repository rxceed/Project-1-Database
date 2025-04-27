import { finalScore, totalChapterScore, totalMistakesAllParams, totalMistakesByParam } from "../controllers";
import express from "express";

const router = express.Router();

router.route("/sum/mistakes").get(totalMistakesByParam);
router.route("/sum/mistakes/all").get(totalMistakesAllParams);
router.route("/sum/chapter_score").get(totalChapterScore);
router.route("/final_score").get(finalScore)

export default router;