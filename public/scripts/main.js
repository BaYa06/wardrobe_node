// Side bar
const header = document.getElementById('header');
const header_right = document.getElementById('header_right');
const close_button = document.getElementById('close_button');
const open_right_block_button = document.getElementById('open_right_block_button');

header.addEventListener('click', () => {
    // Добавить или удалить класс 'open' для header
    header.classList.toggle('open');
    
    // Убедиться, что класс 'open' удаляется у header2, если он был
    if (header_right.classList.contains('open')) {
        header_right.classList.remove('open');
    }
});

open_right_block_button.addEventListener('click', () => {
    // Добавить или удалить класс 'open' для header
    header_right.classList.toggle('open');
    
    // Убедиться, что класс 'open' удаляется у header2, если он был
    if (header.classList.contains('open')) {
        header.classList.remove('open');
    }
});

close_button.addEventListener('click', () => {
    // Добавить или удалить класс 'open' для header2
    header_right.classList.toggle('open');
    
    // Убедиться, что класс 'open' удаляется у header, если он был
    if (header.classList.contains('open')) {
        header.classList.remove('open');
    }
});

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        // Если уже открыта, то закрываем её
        if (card.classList.contains('delete')) {
            card.classList.remove('delete');
        } else {
            // Закрываем все другие карточки
            cards.forEach(c => c.classList.remove('delete'));

            // Открываем только нажатую карточку
            card.classList.add('delete');
        }
    });
});



// Carousel
$(document).ready(function(){
    // Инициализация первой карусели
    $('.carousel1').carousel({
        fullWidth: false,
    });
    // Инициализация первой карусели
    $('.carousel2').carousel({
        fullWidth: false,
    });
    // Автопрокрутка первой карусели
    // setInterval(() => {
    //     $('.carousel1').carousel('next');
    // }, 3000);
});


// Take username from JWT token
function getUsername() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);

        return payload.username;
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// 📌 Выводим имя пользователя в консоль
const username = getUsername();
console.log('Username:', username);

// 📌 Выводим имя пользователя на страниц
if (username) {
    document.getElementById('Name_of_user').textContent = username;
}


// Модальное окно
const modal = document.getElementById('myModal');
const openBtns = document.querySelectorAll('.adding_button'); // Получаем все кнопки
const submitBtn = document.getElementById('submitModal');
const clothesType = document.getElementById('clothesType');
const weatherType = document.getElementById('weatherType');
const closeBtn = document.getElementById('closeModal');
const fileInput = document.getElementById('fileInput'); // Поле загрузки файла
const clearClothesBtn = document.getElementById('clearClothes'); // Кнопка очистки clothesType
const clearWeatherBtn = document.getElementById('clearWeather'); // Кнопка очистки weatherType

// Функция для ограничения ввода
const restrictInput = (input, datalistId) => {
    const options = Array.from(document.getElementById(datalistId).options).map(opt => opt.value);

    input.addEventListener('input', () => {
        const value = input.value;
        // Если значение не в списке, сбрасываем его
        if (value && !options.includes(value)) {
            input.value = '';
        }
    });

    // Запрещаем ручной ввод через клавиатуру, но разрешаем выбор
    input.addEventListener('keydown', (e) => {
        // Разрешаем клавиши для навигации (стрелки, Tab)
        if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(e.key)) return;
        e.preventDefault();
    });
};

// Применяем ограничение к обоим полям
restrictInput(clothesType, 'list-clothes');
restrictInput(weatherType, 'list-weather');

// Функция для закрытия модального окна и очистки полей
const closeModal = () => {
    clothesType.value = '';
    weatherType.value = '';
    fileInput.value = ''; // Очистка загруженного файла
    modal.classList.remove('show');
};

// Функции для очистки отдельных полей
const clearInput = (input) => {
    input.value = '';
};

// Открытие модального окна
openBtns.forEach(button => {
    button.addEventListener('click', () => {
        modal.classList.add('show');
    });
});

// Закрытие модального окна при нажатии на кнопку "Закрыть"
closeBtn.addEventListener('click', closeModal);

// Закрытие модального окна при нажатии на кнопку "Отправить"
submitBtn.addEventListener('click', closeModal);

// Закрытие при клике вне окна
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Очистка полей по кнопке
clearClothesBtn.addEventListener('click', () => clearInput(clothesType));
clearWeatherBtn.addEventListener('click', () => clearInput(weatherType));



