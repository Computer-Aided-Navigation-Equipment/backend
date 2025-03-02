import express from "express";
const router = express.Router();

import {
  addUser,
  changePassword,
  getProfile,
  getUsersBasedOnSearch,
  loginUser,
  refreshToken,
  updateUser,
} from "../controllers/UserController.js";
import isAuth from "../middlewares/isAuth.js";

router.post("/login", loginUser);

router.post("/refresh-token", refreshToken);

router.post("/register", addUser);

router.post("/change-password", isAuth, changePassword);

router.post("/update", isAuth, updateUser);

router.get("/profile", isAuth, getProfile);

router.post("/search", isAuth, getUsersBasedOnSearch);

export default router;
