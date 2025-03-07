import Router from '@koa/router';
import AuthController from '../controllers/authController.js';

const router = new Router();

router.post('/register', AuthController.register); // Регистрация
router.post('/login', AuthController.login);       // Вход

export default router;