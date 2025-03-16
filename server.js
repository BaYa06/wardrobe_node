import Koa from 'koa';
import Router from '@koa/router'; // Используем @koa/router
import serve from 'koa-static';
import { koaBody } from 'koa-body'; // Оставляем только koa-body
import path from 'path';
import { fileURLToPath } from 'url';
import cors from '@koa/cors';

import wardrobeController from './controllers/wardrobeController.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();
const router = new Router();

// Middleware
app.use(cors()); // Разрешаем CORS для всех маршрутов
app.use(koaBody({ multipart: true })); // Парсинг multipart и JSON
app.use(serve(path.join(__dirname, 'public'))); // Раздача статических файлов
app.use(errorHandler); // Обработка ошибок

// Подключение маршрутов
router.use('/api', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/api', userRoutes.routes(), userRoutes.allowedMethods());

// Твои маршруты для гардероба
router.post('/upload', wardrobeController.upload);
router.get('/wardrobe/:id_user', wardrobeController.getWardrobe);

app.use(router.routes()).use(router.allowedMethods());

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});