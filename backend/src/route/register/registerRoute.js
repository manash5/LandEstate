import express from 'express'
import { UserController } from '../../controller/index.js';
const router=express.Router();
router.post("/",UserController.create);




export  {router as registerRouter };
