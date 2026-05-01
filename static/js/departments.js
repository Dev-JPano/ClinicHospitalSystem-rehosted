async function loadDepartments() {
  setStatus('services-status', 'neutral', 'Loading services…', 'Fetching clinic data.');
  try {
    const data = await apiFetch('/api/departments');
    if (!data.length) { setStatus('services-status', 'neutral', 'No services found', 'Check back later.'); return; }
    setStatus('services-status', 'success', `${data.length} services available`, 'Click a service to book.');

    const icons = { WELLNESS:'🌿', PEDIATRICS:'👶', CARDIOLOGY:'❤️', WOMENS_HEALTH:'🌸' };

    document.getElementById('services-list').innerHTML = data.map((d, i) => `
      <div class="dept-card" style="animation-delay:${i * 0.08}s">
        <div class="dept-card-accent"></div>
        <div class="dept-card-body">
          <span class="tag">${icons[d.code] || '🏥'} ${d.code}</span>
          <h3>${d.name}</h3>
          <p>${d.description || ''}</p>
          <div class="dept-meta">
            <div class="dept-meta-item">
              <label>Clinician</label>
              <strong>${d.clinician || '—'}</strong>
            </div>
            <div class="dept-meta-item">
              <label>Consultation Fee</label>
              <strong>₱${parseFloat(d.fee||0).toLocaleString('en-PH',{minimumFractionDigits:2})}</strong>
            </div>
            <div class="dept-meta-item" style="grid-column:span 2">
              <label>Available Hours</label>
              <strong>${d.available_windows || '—'}</strong>
            </div>
          </div>
          <a class="btn btn-primary" href="/appointment?service=${d.code}">Book This Service →</a>
        </div>
      </div>`).join('');
  } catch (err) {
    setStatus('services-status', 'error', 'Failed to load', err.message);
  }
}
loadDepartments();
