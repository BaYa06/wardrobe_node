const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error('Ошибка в middleware:', err.stack); // Подробный вывод ошибки
        ctx.status = err.status || 500;
        ctx.body = { error: err.message || 'Внутренняя ошибка сервера' };
    }
};

export default errorHandler;