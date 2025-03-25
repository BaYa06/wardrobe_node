import Router from '@koa/router';
import { register, login, logout, getUserByToken, getUserInfo} from '../controllers/authController.js';

const router = new Router();

router.post('/register', register); // Регистрация
router.post('/login', login);       // Вход
router.post('/logout', logout);     // Выход
router.get('/get-user', getUserByToken); // Для получения user_id по токену
router.get('/user-info', getUserInfo); // Получение информации о пользователе


export default router;