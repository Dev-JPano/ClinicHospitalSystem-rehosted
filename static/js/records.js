async function loadRecords() {
  setStatus('records-status', 'neutral', 'Loading records…', 'Fetching appointment history.');
  try {
    const data = await apiFetch('/api/records');
    document.getElementById('records-count').textContent = data.length;

    if (!data.length) {
      document.getElementById('latest-patient').textContent = '—';
      setStatus('records-status', 'neutral', 'No records yet', 'Book an appointment to see records here.');
      document.getElementById('records-list').innerHTML = `
        <div class="empty-state">
          <h4>No appointments yet</h4>
          <p>Once a booking is confirmed, it will appear here.</p>
          <a class="btn btn-primary" href="/appointment">Book First Appointment</a>
        </div>`;
      return;
    }

    const latest = data[0];
    document.getElementById('latest-patient').textContent = latest.patient_name.split(' ')[0];
    document.getElementById('latest-service').textContent = SERVICE_LABELS[latest.service_code] || latest.service_code;
    setStatus('records-status', 'success', `${data.length} record${data.length > 1 ? 's' : ''} found`, 'Showing all confirmed bookings.');

    document.getElementById('records-list').innerHTML = `
      <div class="record-row-label">
        <span>Patient</span>
        <span>Service</span>
        <span>Date</span>
        <span>Sessions</span>
        <span>Transaction</span>
      </div>
      ${data.map((r, i) => {
        const booked = r.created_at ? new Date(r.created_at).toLocaleDateString('en-PH',{dateStyle:'medium'}) : '—';
        return `
        <div class="record-row" style="animation-delay:${i * 0.05}s">
          <div class="record-patient">
            <strong>${r.patient_name}</strong>
            <small>${r.patient_email}</small>
          </div>
          <span class="record-pill">${SERVICE_LABELS[r.service_code] || r.service_code}</span>
          <span class="record-text">${r.appointment_date}</span>
          <span class="record-text">${r.sessions_requested}</span>
          <span class="record-muted">${r.transaction_id}</span>
        </div>`;
      }).join('')}
    `;
  } catch (err) {
    setStatus('records-status', 'error', 'Failed to load records', err.message);
  }
}
loadRecords();
