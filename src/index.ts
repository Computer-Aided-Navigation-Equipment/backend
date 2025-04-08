import bodyParser from "body-parser";
import express from "express";
import mongoose, { isValidObjectId } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      /http:\/\/localhost(:\d+)?$/, // Allows any port on localhost
      "http://127.0.0.1", // IPv4 loopback
      /^http:\/\/10\.\d+\.\d+\.\d+$/, // Matches all Android emulator IPs
      "null", // For file:// origins in some environments
    ],
    credentials: true,
  })
);
// app.use(cors({ origin: true, credentials: true }));

app.use(dbConnectionMiddleware);

mongoose
  .connect(process.env.DBURI as string)
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

const router = express.Router();
import UserRouter from "./routes/UserRoutes.js";
router.use("/user", UserRouter);

import LocationRouter from "./routes/LocationRoutes.js";
router.use("/location", LocationRouter);
import ContactRouter from "./routes/ContactRoutes.js";
router.use("/contact", ContactRouter);
import AdminRouter from "./routes/AdminRoutes.js";
router.use("/admin", AdminRouter);
import PathRouter from "./routes/PathLogRoutes.js";
router.use("/log", PathRouter);
import FeedbackRouter from "./routes/FeedbackRoutes.js";
router.use("/feedback", FeedbackRouter);

app.get("/assets/*", (req, res) => {
  const s3BaseUrl =
    "https://aytji-build-files.s3.us-east-1.amazonaws.com/assets";
  const assetPath = req.url.replace("/assets", ""); // Strip out the "/assets" prefix
  const s3Url = `${s3BaseUrl}${assetPath}`;

  console.log(`Redirecting to S3: ${s3Url}`);
  res.redirect(s3Url);
});
app.use("/api", router);

import { fileURLToPath } from "url";
import dbConnectionMiddleware from "./middlewares/isDBConnected.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(buildPath));
app.get("/*", function (req, res) {
  console.log("serving index.html");
  res.sendFile(
    path.join(__dirname, "../../frontend/dist/index.html"),
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
    }
  );
});
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});
