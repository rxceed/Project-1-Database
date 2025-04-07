import { databaseSetup, databaseDrop } from "../controllers";
import express from "express";

const router = express.Router();

router.post("/setup", databaseSetup);
router.delete("/purge", databaseDrop);

export default router;