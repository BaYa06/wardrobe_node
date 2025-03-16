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



const ID_USER = 13; // 📌 Идентификатор пользователя

// Функция ограничения ввода
function restrictInput(input, datalistId) {
    const options = Array.from(document.getElementById(datalistId).options).map(opt => opt.value);

    input.addEventListener('input', () => {
        const value = input.value;
        if (value && !options.includes(value)) {
            input.value = '';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(e.key)) return;
        e.preventDefault();
    });
}

// Основная логика
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const openBtns = document.querySelectorAll('.adding_button');
    const submitBtn = document.getElementById('submitModal');
    const clothesType = document.getElementById('clothesType');
    const weatherType = document.getElementById('weatherType');
    const closeBtn = document.getElementById('closeModal');
    const fileInput = document.getElementById('fileInput');
    const clearClothesBtn = document.getElementById('clearClothes');
    const clearWeatherBtn = document.getElementById('clearWeather');

    // Применение ограничений ввода
    restrictInput(clothesType, 'list-clothes');
    restrictInput(weatherType, 'list-weather');

    // Закрытие модального окна и очистка полей
    const closeModal = () => {
        clothesType.value = '';
        weatherType.value = '';
        fileInput.value = '';
        modal.classList.remove('show');
    };

    // Очистка полей
    const clearInput = (input) => {
        input.value = '';
    };

    // Отправка данных на сервер
    const uploadWardrobeItem = async () => {
        const file = fileInput.files[0];
        const clothes = clothesType.value;
        const weather = weatherType.value;

        if (!file || !clothes || !weather) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id_user', ID_USER);
        formData.append('weather', weather);
        formData.append('clothe', clothes);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Успешно загружено:', result);
            closeModal();
            await displayWardrobeItems(); // Обновляем список после загрузки
        } catch (err) {
            console.error('Ошибка:', err);
            alert(err.message || 'Произошла ошибка при загрузке');
        }
    };

    // Отображение элементов гардероба с фильтром
    const displayWardrobeItems = async () => {
        try {
            const response = await fetch(`http://localhost:3000/wardrobe/${ID_USER}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
            }

            const items = await response.json();

            // Row1
            const row1 = document.getElementById('wardrobe-cards');
            const carousel1 = document.getElementById('carousel1');

            if (!row1 || !carousel1) {
                console.error('Контейнеры wardrobe-cards или carousel1 не найдены');
                return;
            }

            row1.innerHTML = ''; // Очищаем карточки
            carousel1.innerHTML = ''; // Очищаем карусель

            // Фильтрация по 'Head'
            const filteredItems = items.filter(item => item.clothe === 'Head');

            filteredItems.forEach(item => {
                // Карточка для wardrobe-cards
                const card = document.createElement('div');
                card.className = 'card';

                const deleteIcon = document.createElement('div');
                deleteIcon.className = 'delete_icon';
                deleteIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';

                const img = document.createElement('img');
                img.src = item.url;
                img.alt = `${item.clothe} для ${item.weather}`;

                card.appendChild(deleteIcon);
                card.appendChild(img);
                row1.appendChild(card);

                // Элемент карусели для carousel1
                const carouselItem = document.createElement('a');
                carouselItem.className = 'carousel-item';
                carouselItem.href = '#'; // Можно заменить на динамическую ссылку
                carouselItem.innerHTML = `<img src="${item.url}" alt="${item.clothe} для ${item.weather}">`;
                carousel1.appendChild(carouselItem);
            });

            // Row2
            const row2 = document.getElementById('wardrobe-cards2');
            const carousel2 = document.getElementById('carousel2');
            if (!row1) {
                console.error('Контейнер wardrobe-container не найден');
                return;
            }

            row2.innerHTML = ''; // Очищаем контейнер
            carousel2.innerHTML = ''; // Очищаем карусель

            const filteredItems2 = items.filter(item => item.clothe == 'Outerwear');

            filteredItems2.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                const deleteIcon = document.createElement('div');
                deleteIcon.className = 'delete_icon';
                deleteIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';

                const img = document.createElement('img');
                img.src = item.url;
                img.alt = `${item.clothe} для ${item.weather}`;

                card.appendChild(deleteIcon);
                card.appendChild(img);
                row2.appendChild(card);

                // Элемент карусели для carousel1
                const carouselItem = document.createElement('a');
                carouselItem.className = 'carousel-item';
                carouselItem.href = '#'; // Можно заменить на динамическую ссылку
                carouselItem.innerHTML = `<img src="${item.url}" alt="${item.clothe} для ${item.weather}">`;
                carousel2.appendChild(carouselItem);
            });

            // Row3
            const row3 = document.getElementById('wardrobe-cards3');
            const carousel3 = document.getElementById('carousel3');
            if (!row3) {
                console.error('Контейнер wardrobe-container не найден');
                return;
            }

            row3.innerHTML = ''; // Очищаем контейнер
            carousel3.innerHTML = ''; // Очищаем карусель

            const filteredItems3 = items.filter(item => item.clothe == 'Underwear');

            filteredItems3.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                const deleteIcon = document.createElement('div');
                deleteIcon.className = 'delete_icon';
                deleteIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';

                const img = document.createElement('img');
                img.src = item.url;
                img.alt = `${item.clothe} для ${item.weather}`;

                card.appendChild(deleteIcon);
                card.appendChild(img);
                row3.appendChild(card);

                // Элемент карусели для carousel1
                const carouselItem = document.createElement('a');
                carouselItem.className = 'carousel-item';
                carouselItem.href = '#'; // Можно заменить на динамическую ссылку
                carouselItem.innerHTML = `<img src="${item.url}" alt="${item.clothe} для ${item.weather}">`;
                carousel3.appendChild(carouselItem);
            });

            // Row4
            const row4 = document.getElementById('wardrobe-cards4');
            const carousel4 = document.getElementById('carousel4');
            if (!row4) {
                console.error('Контейнер wardrobe-container не найден');
                return;
            }

            row4.innerHTML = ''; // Очищаем контейнер
            carousel4.innerHTML = ''; // Очищаем карусель

            const filteredItems4 = items.filter(item => item.clothe == 'Shoes');

            filteredItems4.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                const deleteIcon = document.createElement('div');
                deleteIcon.className = 'delete_icon';
                deleteIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';

                const img = document.createElement('img');
                img.src = item.url;
                img.alt = `${item.clothe} для ${item.weather}`;

                card.appendChild(deleteIcon);
                card.appendChild(img);
                row4.appendChild(card);

                // Элемент карусели для carousel1
                const carouselItem = document.createElement('a');
                carouselItem.className = 'carousel-item';
                carouselItem.href = '#'; // Можно заменить на динамическую ссылку
                carouselItem.innerHTML = `<img src="${item.url}" alt="${item.clothe} для ${item.weather}">`;
                carousel4.appendChild(carouselItem);
            });

            // Инициализация карусели после добавления элементов
            M.Carousel.init(carousel1, {
                fullWidth: false,
                indicators: true,
                duration: 200
            });

            // Инициализация карусели после добавления элементов
            M.Carousel.init(carousel2, {
                fullWidth: false,
                indicators: true,
                duration: 200
            });

            // Инициализация карусели после добавления элементов
            M.Carousel.init(carousel3, {
                fullWidth: false,
                indicators: true,
                duration: 200
            });

            // Инициализация карусели после добавления элементов
            M.Carousel.init(carousel4, {
                fullWidth: false,
                indicators: true,
                duration: 200
            });

        } catch (err) {
            console.error('Ошибка загрузки гардероба:', err);
            alert(err.message || 'Ошибка загрузки гардероба');
        }
    };

    // Обработчики событий
    openBtns.forEach(button => {
        button.addEventListener('click', () => modal.classList.add('show'));
    });

    closeBtn.addEventListener('click', closeModal);
    submitBtn.addEventListener('click', uploadWardrobeItem);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    clearClothesBtn.addEventListener('click', () => clearInput(clothesType));
    clearWeatherBtn.addEventListener('click', () => clearInput(weatherType));

    // Загрузка элементов при старте
    displayWardrobeItems();
});






