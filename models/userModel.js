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

  static async addToken({ user_id, token }) {
    return db('sessions').insert({ user_id, token });
  }

  static async dellToken(token) {
    return db('sessions').where({ token }).del();
  }

  static async getToken(token) {
    return db('sessions').where({ token });
  }

  static async getUserIdFromToken() {
    const user = await db('users').where({ id: ctx.state.userId }).first();
    return user.user_id;
  }

}

