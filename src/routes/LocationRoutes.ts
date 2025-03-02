import express from "express";
const router = express.Router();

import isAuth from "../middlewares/isAuth.js";

import {
  createLocation,
  deleteLocation,
  getUserLocations,
} from "../controllers/LocationController.js";

router.post("/create", isAuth, createLocation);

router.get("/get-user", isAuth, getUserLocations);

router.post("/delete/:testId", isAuth, deleteLocation);
export default router;
