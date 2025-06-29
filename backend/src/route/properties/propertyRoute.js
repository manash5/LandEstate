import express from 'express'
import { PropertyController } from '../../controller/index.js';
const router=express.Router();
router.get("/",PropertyController.getAll);
router.post("/",PropertyController.create);
router.patch("/:id",PropertyController.update);
router.get("/:id",PropertyController.getById);
router.delete("/:id",PropertyController.deleteById);



export  {router as propertyRouter };


