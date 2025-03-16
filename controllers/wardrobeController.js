import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import Wardrobe from '../models/wardrobeModel.js';
import dotenv from 'dotenv';

dotenv.config();

const wardrobeController = {
    async upload(ctx) {
        console.log('Запрос на /upload получен');
        console.log('Полный объект ctx.request:', JSON.stringify(ctx.request, null, 2));
        console.log('ctx.request.files:', ctx.request.files);

        const file = ctx.request.files?.file;
        const { id_user, weather, clothe } = ctx.request.body;

        console.log('Данные запроса:', { 
            id_user, 
            weather, 
            clothe, 
            file: file ? { name: file.name, path: file.path, filepath: file.filepath, type: file.type } : 'Нет файла' 
        });

        if (!file || !id_user || !weather || !clothe) {
            ctx.status = 400;
            ctx.body = { error: 'Все поля обязательны' };
            return;
        }

        const filePath = file.filepath || file.path; // Поддержка filepath и path
        if (!filePath) {
            ctx.status = 500;
            ctx.body = { error: 'Путь к файлу не определен (ни path, ни filepath)' };
            return;
        }

        console.log('Путь к файлу:', filePath);
        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));
        form.append('key', process.env.IMGBB_API_KEY);

        console.log('Отправка файла на ImgBB...');
        try {
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: form,
            });
            const data = await response.json();

            console.log('Ответ от ImgBB:', data);

            if (!data.success) {
                ctx.status = 500;
                ctx.body = { error: data.error.message || 'Ошибка загрузки на ImgBB' };
                return;
            }

            const fileUrl = data.data.url;

            console.log('Сохранение в базу данных...');
            const newItem = await Wardrobe.create({ id_user, weather, clothe, url: fileUrl });

            ctx.status = 200;
            ctx.body = {
                message: 'Файл успешно загружен',
                id: newItem.id,
                url: newItem.url,
            };
        } catch (err) {
            console.error('Ошибка в upload:', err.stack);
            throw err;
        }
    },

    async getWardrobe(ctx) {
        const id_user = ctx.params.id_user;
        const items = await Wardrobe.findByUserId(id_user);

        ctx.status = 200;
        ctx.body = items;
    },
};

export default wardrobeController;