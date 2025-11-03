const toggleBtn = document.getElementById('theme-toggle');
const icon = toggleBtn.querySelector('i');

function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    icon.classList.toggle('fa-moon', !dark);
    icon.classList.toggle('fa-sun', dark);
}

toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Carrega o tema salvo
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme');
    setTheme(saved === 'dark');
});