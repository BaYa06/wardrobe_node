import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/userModel.js';

const SECRET_KEY = 'secretkey'; // Секретный ключ для JWT

export default class AuthController {
  // Регистрация пользователя
  static async register(ctx) {
    const { username, email, password } = ctx.request.body;

    if (!username || !email || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Заполните все поля' };
      return;
    }

    try {
      await UserModel.register({ username, email, password });
      ctx.status = 201;
      ctx.body = { message: 'Пользователь успешно добавлен' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Не удалось зарегистрировать пользователя' };
    }
  }

  // Вход пользователя
  static async login(ctx) {
    const { loginUsername, loginPassword } = ctx.request.body;

    if (!loginUsername || !loginPassword) {
      ctx.status = 400;
      ctx.body = { error: 'Заполните все поля' };
      return;
    }

    try {
      const user = await UserModel.findByUsername(loginUsername);
      if (!user) {
        ctx.status = 401;
        ctx.body = { message: 'Пользователь не найден' };
        return;
      }

      const isMatch = await bcrypt.compare(loginPassword, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        ctx.cookies.set('token', token, { httpOnly: true });
        ctx.status = 200;
        ctx.body = { message: 'Вход успешен', token };
      } else {
        ctx.status = 401;
        ctx.body = { message: 'Неверный пароль' };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Ошибка при входе' };
    }
  }
}