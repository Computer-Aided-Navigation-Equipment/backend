import express from "express";
const router = express.Router();

import isAuth from "../middlewares/isAuth.js";
import {
  getLogs,
  getUserAlerts,
  getUserLogs,
} from "../controllers/AdminController.js";

router.get("/get-logs", isAuth, getLogs);

router.get("/get-user-logs/:userId", isAuth, getUserLogs);
router.get("/get-user-alerts/:userId", isAuth, getUserAlerts);

export default router;
