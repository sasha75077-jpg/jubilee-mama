// === Приёмник ответов: ваша Google-форма ===
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScRgHN66GUX0arAg44J38YPu-zRh1FvLNFb2bRAFccskD24HQ/formResponse';

// Текст вариантов поля "Вы придёте?" (должен совпадать с формой)
const ATTENDANCE_LABELS = {
    yes: '✅ Да, обязательно приду!',
    maybe: '🤔 Пока не уверен(а)',
    no: '😔 К сожалению, не смогу'
};

// ID поля «Напитки» в Google-форме
const ENTRY_DRINKS = 'entry.1786126185';

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

    // Отправка в Google-форму (скрытый iframe — гость ничего лишнего не видит)
    try {
        const params = new URLSearchParams();
        params.append('entry.571643149', formData.name);        // Ваше имя
        params.append('entry.2019439900', formData.phone);      // Телефон
        params.append('entry.1807244277', formData.guests);     // Количество гостей
        params.append('entry.250966081', formData.attendance);  // Вы придёте?
        params.append(ENTRY_DRINKS, formData.drinks);           // Напитки
        params.append('entry.471263011', formData.message);     // Пожелания

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = GOOGLE_FORM_URL + '?' + params.toString();
        document.body.appendChild(iframe);
    } catch (err) {
        console.error('Не удалось отправить ответ:', err);
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
