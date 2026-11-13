// === Приёмник ответов: Google Apps Script → Google-таблица ===
// Ссылка вида https://script.google.com/macros/s/AKfy.../exec
// Пока пусто — работает старая отправка в Google-форму (строки ниже).
const ANSWERS_URL = 'https://script.google.com/macros/s/AKfycbxzuVrt1fxZV2x4t6S4FS8MmKPwOUlMmFqQPnbmmAjqUF1qAPC7_V-AesQQxVNwzg-h/exec';

// === Старая схема: отправка в Google-форму (резерв) ===
// ВАЖНО: у формы должен быть доступ «Все, у кого есть ссылка».
// При «Ограниченном доступе» Google отвечает 401 и ответы гостей молча теряются.
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScRgHN66GUX0arAg44J38YPu-zRh1FvLNFb2bRAFccskD24HQ/formResponse';

// Текст вариантов поля "Вы придёте?" (должен совпадать с формой)
const ATTENDANCE_LABELS = {
    yes: '✅ Да, обязательно приду!',
    maybe: '🤔 Пока не уверен(а)',
    no: '😔 К сожалению, не смогу'
};

// ID поля «Напитки» в Google-форме
const ENTRY_DRINKS = 'entry.1786126185';

// --- Отправка в Apps Script (основной путь) ---
function sendToAnswers(data) {
    postHidden(ANSWERS_URL, 'answers_sink', [
        ['name', data.name],
        ['phone', data.phone],
        ['guests', data.guests],
        ['attendance', data.attendance],
        ['drinks', data.drinks],
        ['message', data.message]
    ]);
}

// --- Отправка в Google-форму (резервный путь) ---
function sendToGoogleForm(formData) {
    postHidden(GOOGLE_FORM_URL, 'gform_sink', [
        ['entry.571643149', formData.name],        // Ваше имя
        ['entry.2019439900', formData.phone],      // Телефон
        ['entry.1807244277', formData.guests],     // Количество гостей
        ['entry.250966081', formData.attendance],  // Вы придёте?
        [ENTRY_DRINKS, formData.drinks],           // Напитки
        ['entry.471263011', formData.message]      // Пожелания
    ]);
}

// Универсальная отправка: скрытая форма + скрытый iframe (POST, без ограничения длины и без CORS)
function postHidden(url, frameName, fields) {
    try {
        let iframe = document.querySelector('iframe[name="' + frameName + '"]');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = frameName;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        const form = document.createElement('form');
        form.action = url;
        form.method = 'POST';
        form.target = frameName;
        form.style.display = 'none';

        fields.forEach(function(pair) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = pair[0];
            input.value = pair[1];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        setTimeout(function() { form.remove(); }, 5000);
    } catch (err) {
        console.error('Не удалось отправить ответ:', err);
    }
}

// Handle form submission
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const guestsSelect = document.getElementById('guests');
    const guestsLabel = guestsSelect.options[guestsSelect.selectedIndex].text;

    // Выбор напитков (можно несколько) + свой вариант
    const checkedDrinks = Array.from(document.querySelectorAll('input[name="drinks"]:checked')).map(el => el.value);
    const drinkOther = document.getElementById('drinkOther').value.trim();
    const drinkList = checkedDrinks.filter(v => !(v === 'Свой вариант' && drinkOther));
    if (drinkOther) drinkList.push('свой вариант: ' + drinkOther);
    const drinksText = drinkList.join(', ');

    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        guests: guestsLabel,
        attendance: ATTENDANCE_LABELS[attendance] || attendance,
        drinks: drinksText,
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toLocaleString('ru-RU')
    };

    // Куда отправляем: в Apps Script (если настроен) или в Google-форму
    if (ANSWERS_URL) {
        sendToAnswers(formData);
    } else {
        sendToGoogleForm(formData);
    }

    // Локальная копия на устройстве гостя (бэкап)
    let responses = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
    responses.push(formData);
    localStorage.setItem('rsvpResponses', JSON.stringify(responses));

    // Show success message
    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';

    // Scroll to success message
    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
});

// Add sparkle effect on page load
window.addEventListener('load', function() {
    createSparkles();
});

function createSparkles() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 5px;
                height: 5px;
                background: white;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sparkle ${2 + Math.random() * 3}s ease-in-out infinite;
                opacity: 0;
            `;
            hero.appendChild(sparkle);
        }, i * 100);
    }
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);
