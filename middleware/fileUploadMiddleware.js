import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer Storage Config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // create uploads folder if not exists
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueName = `${base}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// Multer File Filter (images and videos only)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif|mp4|mov|avi|webm|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images and videos only!"));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB for videos
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
