// app.js

const form = document.getElementById('pcrForm');
const resetBtn = document.getElementById('resetBtn');

const STORAGE_KEY = 'secamb-pcr-form-data';

// Load saved form data from localStorage
function loadFormData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    for (const [key, value] of Object.entries(data)) {
      const el = form.elements[key];
      if (!el) continue;
      if (el.type === 'checkbox') {
        if (Array.isArray(value)) {
          // multiple checkboxes with same name
          value.forEach(val => {
            const checkbox = form.querySelector(`input[name="${key}"][value="${val}"]`);
            if (checkbox) checkbox.checked = true;
          });
        } else {
          el.checked = value;
        }
      } else if (el.type === 'radio') {
        const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        el.value = value;
      }
    }
  } catch (err) {
    console.error('Failed to load form data', err);
  }
}

// Save form data to localStorage
function saveFormData() {
  const data = {};
  for (const element of form.elements) {
    if (!element.name) continue;
    if (element.type === 'checkbox') {
      if (!data[element.name]) data[element.name] = [];
      if (element.checked) data[element.name].push(element.value);
    } else if (element.type === 'radio') {
      if (element.checked) data[element.name] = element.value;
    } else {
      data[element.name] = element.value;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  alert('Form saved locally!');
}

// Reset form and clear saved data
function resetForm() {
  if (confirm('Are you sure you want to clear the form?')) {
    form.reset();
    localStorage.removeItem(STORAGE_KEY);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  saveFormData();
});

// Reset button handler
resetBtn.addEventListener('click', resetForm);

// Load form data on start
window.addEventListener('load', loadFormData);

// PWA service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered.', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

