import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const dbPool = mysql.createPool({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dateStrings: true
})

const executeQuery = async (sql, values=[]) =>{
  let connection;
  try {
      connection =  await dbPool.getConnection();
      let [result] = await connection.query(sql, values);
      return result
  } catch (error) {
      throw error;
  }finally{
      connection.release();
  }
}
export default executeQuery;