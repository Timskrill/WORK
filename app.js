// Ключи для localStorage
const NOTES_KEY = "user_notes";
const THEME_KEY = "user_theme";

// DOM элементы
const notesListDiv = document.getElementById("notesList");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const newNoteBtn = document.getElementById("newNoteBtn");
const statusDiv = document.getElementById("storageStatus");
const themeBtn = document.getElementById("themeBtn");

let notes = [];           // массив заметок
let currentNoteId = null; // id выбранной заметки
let currentTheme = "light";

// --- Работа с заметками ---

// Загрузка заметок из localStorage
function loadNotes() {
    const saved = localStorage.getItem(NOTES_KEY);
    if (saved) {
        notes = JSON.parse(saved);
    } else {
        notes = [];
    }
}

// Сохранение заметок в localStorage
function saveNotesToStorage() {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// Создание новой заметки
function createNewNote() {
    const newNote = {
        id: Date.now(),
        title: "Новая заметка",
        content: "",
        date: new Date().toLocaleString()
    };
    notes.unshift(newNote);
    saveNotesToStorage();
    renderNotesList();
    selectNote(newNote.id);
    statusDiv.textContent = "Создана новая заметка";
}

// Выбор заметки для редактирования
function selectNote(id) {
    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    if (note) {
        noteTitle.value = note.title;
        noteContent.value = note.content;
    }
    renderNotesList();
}

// Сохранение текущей заметки
function saveCurrentNote() {
    if (currentNoteId === null) {
        if (notes.length === 0) {
            createNewNote();
        } else {
            currentNoteId = notes[0].id;
        }
    }
    
    const index = notes.findIndex(n => n.id === currentNoteId);
    if (index !== -1) {
        notes[index].title = noteTitle.value || "Без названия";
        notes[index].content = noteContent.value;
        notes[index].date = new Date().toLocaleString();
        saveNotesToStorage();
        renderNotesList();
        statusDiv.textContent = "Сохранено";
    }
}

// Удаление текущей заметки
function deleteCurrentNote() {
    if (currentNoteId === null) {
        statusDiv.textContent = "Нет заметки для удаления";
        return;
    }
    
    notes = notes.filter(n => n.id !== currentNoteId);
    saveNotesToStorage();
    
    if (notes.length > 0) {
        selectNote(notes[0].id);
    } else {
        currentNoteId = null;
        noteTitle.value = "";
        noteContent.value = "";
    }
    renderNotesList();
    statusDiv.textContent = "Заметка удалена";
}

// Отображение списка заметок
function renderNotesList() {
    if (notes.length === 0) {
        notesListDiv.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">Нет заметок</div>';
        return;
    }
    
    notesListDiv.innerHTML = "";
    notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note-item";
        if (currentNoteId === note.id) {
            div.classList.add("active");
        }
        
        const titleSpan = document.createElement("span");
        titleSpan.className = "note-item-title";
        titleSpan.textContent = note.title.length > 30 ? note.title.slice(0, 27) + "..." : note.title;
        
        const dateSpan = document.createElement("span");
        dateSpan.className = "note-item-date";
        dateSpan.textContent = note.date;
        
        div.appendChild(titleSpan);
        div.appendChild(dateSpan);
        div.onclick = () => selectNote(note.id);
        notesListDiv.appendChild(div);
    });
}

// --- Работа с темой ---

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

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }
}

function saveTheme() {
    localStorage.setItem(THEME_KEY, currentTheme);
}

function toggleTheme() {
    if (currentTheme === "dark") {
        applyTheme("light");
    } else {
        applyTheme("dark");
    }
    saveTheme();
    statusDiv.textContent = "Тема изменена";
}

// --- Инициализация ---

function init() {
    loadNotes();
    loadTheme();
    
    if (notes.length > 0) {
        selectNote(notes[0].id);
    } else {
        createNewNote();
    }
    
    saveBtn.addEventListener("click", saveCurrentNote);
    deleteBtn.addEventListener("click", deleteCurrentNote);
    newNoteBtn.addEventListener("click", createNewNote);
    themeBtn.addEventListener("click", toggleTheme);
    
    statusDiv.textContent = "Готово к работе";
}

init();