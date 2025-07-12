import express from "express";
import upload from "../middleware/multerConfig.js";
import { uploadFile } from "../controller/fileController.js";

const router = express.Router();

// Route for single file upload
router.post("/upload", upload.single("file"), uploadFile, (req, res)=>{
    console.log(req.body); 
    console.log(req.file); 
});

export default router;
