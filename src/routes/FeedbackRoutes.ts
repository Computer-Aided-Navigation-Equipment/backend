import express from "express";
const router = express.Router();

import isAuth from "../middlewares/isAuth.js";
import {
  createFeedback,
  getAllFeedbacks,
} from "../controllers/FeedbackController.js";

router.post("/create", isAuth, createFeedback);

router.get("/get-all", isAuth, getAllFeedbacks);

export default router;
