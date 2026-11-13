# Сайт-приглашение на юбилей — 50 лет

Элегантное приглашение в тёмно-коричнево-кремовой гамме (Playfair Display + Cormorant Garamond + Marck Script).

## 🌐 Адрес сайта

**https://sasha75077-jpg.github.io/jubilee-mama/**

Репозиторий: `sasha75077-jpg/jubilee-mama` (ветка `main`, GitHub Pages).

## 📁 Файлы

| Файл | Назначение |
|---|---|
| `index.html` | Главная страница: приглашение, детали, форма RSVP |
| `style.css` | Всё оформление (палитра, шрифты, адаптив) |
| `script.js` | Отправка ответов в Google-форму + эффект искр |
| `mama.jpg` | Фотография именинницы |
| `admin.html` | Локальный просмотр ответов (браузерное хранилище) |

## 📥 Как ответы попадают в таблицу

```
Сайт  →  Google Apps Script  →  Google-таблица «Ответы на юбилей — 50 лет»
```

Сайт отправляет ответы в веб-приложение Apps Script (POST), скрипт дописывает строку в таблицу.
**Google-форма в приёме ответов больше не участвует** — поэтому история с доступом и `401` больше не влияет на сайт.

- Скрипт (исходник): `apps-script/Code.gs`
- Код скрипта: https://script.google.com/u/0/home/projects/1bCtTZJoJy-jxLRqa5Gb7MhkTGnXDpgLnEJEgpA-_ga4L8SsFEdYcGj-o/edit
- Веб-приложение (`/exec`): https://script.google.com/macros/s/AKfycbxzuVrt1fxZV2x4t6S4FS8MmKPwOUlMmFqQPnbmmAjqUF1qAPC7_V-AesQQxVNwzg-h/exec
- **Таблица с ответами**: https://docs.google.com/spreadsheets/d/1wdxbVjSR5lYv83NUapK9Ttd49d-zaeFQeq98jhSXY2I/edit

Колонки: `Время | Ваше имя | Телефон | Количество гостей | Вы придёте? | Напитки | Пожелания`

### Проверка в любой момент

```
curl "https://script.google.com/macros/s/AKfycbxzuVrt1fxZV2x4t6S4FS8MmKPwOUlMmFqQPnbmmAjqUF1qAPC7_V-AesQQxVNwzg-h/exec?info=1"
```

Вернёт `{"sheet": "...", "url": "...", "rows": N}` — N это количество ответов в таблице.

### Если понадобится поменять код скрипта

Правки в редакторе → **Развернуть → Управление развёртываниями → (карандаш) → Версия: Новая версия → Развернуть**.
Ссылка `/exec` при этом остаётся прежней.

## 📊 Старая схема (Google-форма)

Google-форма «Юбилей» и её `.xlsx`-выгрузки остаются как архив, но сайт в неё больше не пишет.
Если когда-нибудь понадобится вернуть — достаточно очистить `ANSWERS_URL` в `script.js`.

ID полей формы (резервный путь, в `script.js`):

| Поле сайта | entry |
|---|---|
| Ваше имя | `entry.571643149` |
| Телефон | `entry.2019439900` |
| Количество гостей | `entry.1807244277` |
| Вы придёте? | `entry.250966081` |
| Напитки | `entry.1786126185` |
| Пожелания | `entry.471263011` |

## ⚠️ Старое предупреждение (только для резервной схемы)

Если когда-нибудь вернёте `ANSWERS_URL = ''`, снова включится отправка в Google-форму.
Тогда помните: Google отклоняет анонимные отправки (`HTTP 401`), если у формы стоит **«Ограниченный доступ»**.

**Лечение:** форма → «Поделиться» → **«Все, у кого есть ссылка»**.

## 📊 Где смотреть ответы

**Таблица с ответами:** https://docs.google.com/spreadsheets/d/1wdxbVjSR5lYv83NUapK9Ttd49d-zaeFQeq98jhSXY2I/edit

- С телефона — приложение **«Таблицы Google»**, вход под тем же аккаунтом
- Скачать в Excel: Файл → Скачать → Microsoft Excel (`.xlsx`) — это будет копия на момент скачивания

## ✏️ Как изменить

- **Тексты, дата, место** — в `index.html`
- **Цвета, шрифты, отступы** — в `style.css` (палитра в начале файла, переменные `--espresso`, `--cream`, `--sand` и т.д.)
- **Ссылка на приёмник ответов** — `script.js`, константа `ANSWERS_URL`

После правок:

```bash
git add -A
git commit -m "Обновление"
git push
```

GitHub Pages пересоберёт сайт за 1–2 минуты.

## 🔎 Полезные ссылки

- Форма (публичная): https://forms.gle/u9WY6FsBBWniYTM4A
- Форма (редактор): https://docs.google.com/forms/d/1p_hMtRtoyUJLIj3IM9XEB8sd0JvlBS77re_ysMOT7xc/edit
- Репозиторий: https://github.com/sasha75077-jpg/jubilee-mama
