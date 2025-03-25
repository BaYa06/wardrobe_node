import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Joi from 'joi';
import UserModel from '../models/userModel.js';
import db from '../db.js';

const generateToken = () => crypto.randomBytes(32).toString('hex');

const USERNAME_MIN = 4;
const PASSWORD_MIN = 8;


// Схема валидации для регистрации
const registerSchema = Joi.object({
  username: Joi.string().min(USERNAME_MIN).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(PASSWORD_MIN).required(),
});

// Схема валидации для входа
const loginSchema = Joi.object({
  loginUsername: Joi.string().required(),
  loginPassword: Joi.string().required(),
});


// Регистрация пользователя
const register = async (ctx) => {
  const { username, email, password } = ctx.request.body;

  // Валидация входных данных
  const { error } = registerSchema.validate({ username, email, password });
  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details.map(err => err.message) };
    return;
  }


  try {
    await UserModel.register({ username, email, password });
    ctx.status = 201;
    ctx.body = { message: 'Пользователь успешно добавлен' };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'Не удалось зарегистрировать пользователя' };
  }
};

// Вход пользователя
const login = async (ctx) => {
  const { loginUsername, loginPassword } = ctx.request.body;

  // Валидация входных данных
  const { error } = loginSchema.validate({ loginUsername, loginPassword });
  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details.map(err => err.message) };
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

      const token = generateToken();
      const addToken = await UserModel.addToken({ user_id: user.id, token });
      if (!addToken) {
        ctx.status = 500;
        ctx.body = { error: 'Token is not saved!' };
        return;
      } 

      ctx.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });
      ctx.status = 200;
      ctx.body = { message: 'Вход успешен', token };
    } else {
      ctx.status = 401;
      ctx.body = { message: 'Неверный пароль' };
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'Ошибка при входе' };
  }
};

const getUserInfo = async (ctx) => {
  const userId = ctx.state.userId; // Получаем user_id из authMiddleware
  const user = await db('users').where({ id: userId }).first();

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }

  ctx.body = { username: user.username };
};

const logout = async (ctx) => {
  const token = ctx.cookies.get('authToken');
  if (token) {
    await UserModel.dellToken(token);
    ctx.cookies.set('authToken', '', { maxAge: 0 });
  }
  ctx.body = { message: 'Logget out successfully' };
};

const getUserByToken = async (ctx) => {
  const token = ctx.cookies.get('authToken'); // Извлекаем токен из httpOnly куки

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'No token provided' };
    return;
  }

  try {
    const session = await db('sessions')
      .where({ token })
      .andWhere('expires_at', '>', new Date()) // Проверяем, что токен не истек
      .first();

    const session2 = await db('users')
      .where({ id: session.user_id })
      .first();

    if (!session) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid or expired token' };
      return;
    }

    if (!session2) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { token, userId: session.user_id, user: session2.username }; // Возвращаем токен и user_id
  } catch (error) {
    console.error('Error fetching session:', error);
    ctx.status = 500;
    ctx.body = { error: 'Server error' };
  }
};

export { logout, register, login, getUserInfo, getUserByToken };