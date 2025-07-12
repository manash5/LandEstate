import express from 'express'
import { PropertyController } from '../../controller/index.js';
import upload from '../../middleware/multerConfig.js'; 

const router = express.Router();

router.get("/", PropertyController.getAll);
router.get("/user/:userId", PropertyController.getByUserId);
router.post("/", upload.array('images', 10), PropertyController.create); 
router.patch("/:id", PropertyController.update);
router.get("/:id", PropertyController.getById);
router.delete("/:id", PropertyController.deleteById);

export { router as propertyRouter };