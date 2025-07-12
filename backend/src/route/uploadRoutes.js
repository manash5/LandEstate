import express from "express";
import upload from "../middleware/multerConfig.js";
import { uploadFile } from "../controller/fileController.js";

const router = express.Router();

// Route for single file upload
router.post("/upload", upload.single("file"), uploadFile, (req, res)=>{
    console.log(req.body); 
    console.log(req.file); 
});

// Route for multiple images 
router.post('/photos/upload', upload.array('photos', 12), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  res.status(200).json({
    message: "Files uploaded successfully!",
    files: req.files
  });
});

export default router;
