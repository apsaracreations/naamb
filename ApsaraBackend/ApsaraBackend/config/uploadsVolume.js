// Persistent uploads on Railway.
// Container disks are wiped on every deploy, so uploaded images must live on a
// mounted volume. When UPLOADS_DIR is set (e.g. /data/uploads), we copy the
// images shipped in the repo into it (never overwriting) and point the local
// "uploads" folder at it, so all existing multer/static code keeps working.
// Must be imported before any route file (they create uploads/* at import time).
import fs from "fs";
import path from "path";

const target = process.env.UPLOADS_DIR;
const local = path.resolve("uploads");

if (target && path.resolve(target) !== local) {
  try {
    fs.mkdirSync(target, { recursive: true });
    const stat = fs.lstatSync(local, { throwIfNoEntry: false });
    if (stat && !stat.isSymbolicLink()) {
      fs.cpSync(local, target, { recursive: true, force: false, errorOnExist: false });
      fs.rmSync(local, { recursive: true, force: true });
    }
    if (!stat || !stat.isSymbolicLink()) fs.symlinkSync(path.resolve(target), local, "junction");
    console.log(`Uploads stored on volume: ${target}`);
  } catch (err) {
    console.error("Uploads volume setup failed:", err);
  }
}
