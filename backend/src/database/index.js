import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',// other example mysql,oracle,h2
  }
);

export const db = () => {
  try {
    sequelize.sync({alter:true})
    console.log("database connected successfully")

  } catch (e) {
    console.error("fail to connect database successfully",e)
  }
}


