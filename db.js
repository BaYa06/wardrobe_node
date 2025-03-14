import Knex from 'knex';
import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные из .env

const db = Knex({
  client: 'pg', // используем PostgreSQL
  connection: process.env.DB_CONNECTION,
});

// Функция для получения данных из таблицы students
export async function getStudents() {
  try {
    const students = await db('users').select('*'); // Запрос на выбор всех данных из таблицы students
    return students;
  } catch (error) {
    console.error('Ошибка при получении студентов:', error);
    throw error;
  }
}

export default db;