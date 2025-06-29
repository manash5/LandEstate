import express from 'express'
import bodyParser  from 'body-parser';
import { db } from './database/index.js';
import {userRouter} from './route/index.js'
import {propertyRouter} from './route/index.js'
import dotenv from 'dotenv'
import cors from 'cors'; 

dotenv.config();


const app=express();
app.use(cors())
const port=process.env.PORT||4000
app.use(bodyParser.json());
app.use('/api/users',userRouter)
app.use('/api/properties', propertyRouter)

app.listen(port, function() {
  console.log(`project running in port ${port}`)
  db()
})