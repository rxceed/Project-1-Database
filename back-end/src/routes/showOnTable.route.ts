import express from "express";
import { showOnTable } from "../controllers";

const router = express.Router();

router.route("/").get(showOnTable);

export default router;