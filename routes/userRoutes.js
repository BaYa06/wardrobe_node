import Router from '@koa/router';
import UserController from '../controllers/userController.js';

const router = new Router();

router.get('/users', UserController.getUsers); // Получение списка пользователей

export default router;