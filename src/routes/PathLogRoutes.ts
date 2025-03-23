import express from "express";
const router = express.Router();

import isAuth from "../middlewares/isAuth.js";
import {
  createAlertLog,
  createPathLog,
} from "../controllers/PathLogController.js";

router.post("/create", isAuth, createPathLog);

router.post("/alert", isAuth, createAlertLog);

export default router;
