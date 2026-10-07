import mysql from 'mysql2/promise';
export const db = mysql.createPool({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME||'radius',connectionLimit:10});
export async function q<T=any>(sql:string, params:any[]=[]){const [rows]=await db.query(sql,params);return rows as T;}
