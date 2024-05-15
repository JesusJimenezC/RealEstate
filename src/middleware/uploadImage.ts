import multer from "multer";
import path from "path";
import { generateId } from "../helpers/token.ts";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./src/public/uploads");
    return;
  },
  filename: function (_req, file, cb) {
    cb(null, generateId() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

export default upload;
