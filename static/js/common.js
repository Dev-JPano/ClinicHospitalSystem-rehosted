// Rosewell Health — common.js
const API_BASE = '';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function setStatus(id, type, title, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `status-card ${type}`;
  el.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
}

const SERVICE_LABELS = {
  WELLNESS:      'Wellness Consultation',
  PEDIATRICS:    'Pediatrics Visit',
  CARDIOLOGY:    'Cardiology Review',
  WOMENS_HEALTH: "Women's Health Consultation",
};
