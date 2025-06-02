const toggleBtn = document.getElementById('toggle-theme');
const body = document.body;

// Load saved theme from localStorage or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  body.classList.add('dark');
  toggleBtn.textContent = 'Dark Mode';
} else {
  toggleBtn.textContent = 'Light Mode';
}

toggleBtn.addEventListener('click', () => {
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    toggleBtn.textContent = 'Light Mode';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark');
    toggleBtn.textContent = 'Dark Mode';
    localStorage.setItem('theme', 'dark');
  }
});
