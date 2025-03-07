import Knex from 'knex';

const db = Knex({
  client: 'pg', // используем PostgreSQL
  connection: 'postgres://admin:admin@localhost/wardrobe_db' // строка подключения
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