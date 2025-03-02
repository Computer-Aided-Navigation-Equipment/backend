import express from "express";
const router = express.Router();

import isAuth from "../middlewares/isAuth.js";
import { createPathLog } from "../controllers/PathLogController.js";

router.post("/create", isAuth, createPathLog);
