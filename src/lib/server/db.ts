import { DB_URL } from '$env/static/private';
import mysql from 'mysql2/promise';

const db = mysql.createPool(DB_URL);

export default db;
