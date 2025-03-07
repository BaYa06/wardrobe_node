import bcrypt from 'bcrypt';
import db from '../db.js';

export default class UserModel {
  // Регистрация пользователя
  static async register({ username, email, password }) {
    const hashPass = await bcrypt.hash(password, 10); // Хеширование пароля
    return db('users').insert({ username, email, password: hashPass });
  }

  // Поиск пользователя по имени
  static async findByUsername(username) {
    return db('users').where({ username }).first();
  }

  // Получение списка студентов (всех пользователей)
  static async getStudents() {
    return db('users').select('*');
  }
}