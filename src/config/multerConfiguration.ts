import { S3 } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Configure Multer with S3
const upload = multer({
  storage: (() => {
    try {
      if (!process.env.S3_BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME environment variable is not set");
      }

      return multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
          const uniqueFileName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueFileName);
        },
      });
    } catch (error) {
      console.error("S3 configuration error:", error.message);
      return multer.memoryStorage(); // Use memory storage as a placeholder
    }
  })(),
  limits: {
    fileSize: 30 * 1024 * 1024, // Maximum file size: 5MB
    files: 10, // Maximum number of files
  },
  fileFilter: (
    req,
    file,
    cb: (error: Error | null, accept?: boolean) => void
  ) => {
    cb(null, true); // Accept all file types
  },
});

export { upload, s3 }; // Use export for ES module syntax
