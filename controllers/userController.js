import UserModel from '../models/userModel.js';

export default class UserController {
  // Получение списка пользователей
  static async getUsers(ctx) {
    try {
      const students = await UserModel.getStudents();
      ctx.body = students;
      ctx.status = 200;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Не удалось получить список студентов' };
    }
  }
}