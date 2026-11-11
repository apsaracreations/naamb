import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const ALLOWED = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/avif": [".avif"],
};

// Image-only uploads into uploads/<folder>, max 5 MB each, random file names.
// Stops HTML/JS/SVG files being uploaded and then served from the shop's domain.
export const imageUpload = (folder) => {
  const dir = path.join("uploads", folder);
  fs.mkdirSync(dir, { recursive: true });

  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, dir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024, files: 5 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const ok = ALLOWED[file.mimetype]?.includes(ext);
      cb(ok ? null : new Error("Only JPG, PNG, WEBP, GIF or AVIF images are allowed"), ok);
    },
  });
};
