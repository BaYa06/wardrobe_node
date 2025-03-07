import Koa from 'koa';
import Router from '@koa/router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import path from 'path';
import { fileURLToPath } from 'url';

// Импорт маршрутов
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();
const router = new Router();

// Middleware
app.use(bodyParser()); // Парсинг тела запроса
app.use(serve(path.join(__dirname, 'public'))); // Раздача статических файлов

// Подключение маршрутов
router.use('/api', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/api', userRoutes.routes(), userRoutes.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});