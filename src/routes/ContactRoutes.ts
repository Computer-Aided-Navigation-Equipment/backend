import express from "express";
const router = express.Router();

import isAuth from "../middlewares/isAuth.js";
import {
  createContact,
  deleteContact,
  getUserContacts,
} from "../controllers/ContactController.js";

router.get("/get-user", isAuth, getUserContacts);

router.post("/create", isAuth, createContact);

router.post("/delete/:contactId", isAuth, deleteContact);

export default router;
