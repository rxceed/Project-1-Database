import express from "express";
import {getChapterByID_andOr_ProjectID, getAllChapters,
    insertNewChapter, alterChapter, deleteAllChaptersByProjectID, deleteChapterByID} from "../controllers"

const router = express.Router();

router.route("/").get(getChapterByID_andOr_ProjectID).post(insertNewChapter).patch(alterChapter).delete(deleteChapterByID);
router.route("/all").get(getAllChapters);
router.route("/purge").delete(deleteAllChaptersByProjectID);

export default router;