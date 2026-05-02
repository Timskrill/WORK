// 1. При загрузке: getItem → восстановить заметку и тему
// 2. Кнопка «Сохранить»: setItem → записать текст и тему
// 3. Кнопка «Очистить»: removeItem + очистить поле
// 4. Смена темы: применяется сразу, сохраняется по кнопке «Сохранить»

const STORAGE_KEY = "user_note";
const THEME_KEY = "user_theme";

const textarea = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const statusDiv = document.getElementById("storageStatus");
const themeBtn = document.getElementById("themeBtn");

let currentTheme = "light"; // текущая тема (light/dark)

// Применение темы к странице
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        themeBtn.textContent = "Светлая тема";
    } else {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        themeBtn.textContent = "Тёмная тема";
    }
    currentTheme = theme;
}

// Загрузка заметки и темы при старте
function loadData() {
    // Загружаем заметку
    const savedNote = localStorage.getItem(STORAGE_KEY);
    if (savedNote !== null) {
        textarea.value = savedNote;
        statusDiv.textContent = "Заметка восстановлена";
    } else {
        textarea.value = "";
        statusDiv.textContent = "Нет сохранённой заметки";
    }
    
    // Загружаем тему
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }
}

// Сохранение заметки и темы (по кнопке «Сохранить»)
function saveNote() {
    const text = textarea.value;
    localStorage.setItem(STORAGE_KEY, text);
    localStorage.setItem(THEME_KEY, currentTheme);
    statusDiv.textContent = "Сохранено (заметка + тема)";
}

// Очистка заметки (тема не сбрасывается)
function clearNote() {
    textarea.value = "";
    localStorage.removeItem(STORAGE_KEY);
    // Тему НЕ удаляем, только заметку
    statusDiv.textContent = "Очищено (заметка удалена, тема сохранена)";
}

// Переключение темы (меняет только внешний вид, не сохраняет в localStorage)
function toggleTheme() {
    if (currentTheme === "dark") {
        applyTheme("light");
    } else {
        applyTheme("dark");
    }
    // Тема ещё не сохранена, будет сохранена только по кнопке «Сохранить»
    statusDiv.textContent = "Тема изменена. Нажмите «Сохранить», чтобы запомнить.";
}

// Назначение обработчиков
saveBtn.addEventListener("click", saveNote);
clearBtn.addEventListener("click", clearNote);
themeBtn.addEventListener("click", toggleTheme);

// Загружаем при старте
loadData();