const multer = require("multer");
const { resolve } = require("node:path");
const { v4 } = require("uuid");
const fs = require("fs");

const uploadFolder = resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

module.exports = {
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
      const uniqueName = `${v4()}-${file.originalname}`;
      return cb(null, uniqueName);
    },
  }),
};