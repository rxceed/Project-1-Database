import { getAllSubAspects, getSubAspectByID_andOr_ParamID, insertNewSubAspect, alterSubAspect, deleteAllSubAspectsByParamID, deleteSubAspectsByID } from "../controllers";
import express from "express";

const router = express.Router();

router.route("/").get(getSubAspectByID_andOr_ParamID).post(insertNewSubAspect).patch(alterSubAspect).delete(deleteSubAspectsByID);
router.route("/all").get(getAllSubAspects);
router.route("/purge").delete(deleteAllSubAspectsByParamID);

export default router;