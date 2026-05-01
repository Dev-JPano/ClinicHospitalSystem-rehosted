// Pre-fill service from URL param
(function() {
  const s = new URLSearchParams(window.location.search).get('service');
  if (s) { const el = document.getElementById('serviceCode'); if (el) el.value = s; }
})();

document.getElementById('appointment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Submitting…';
  setStatus('appointment-status', 'neutral', 'Processing…', 'Submitting your appointment request.');

  try {
    const data = await apiFetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name:       document.getElementById('patientName').value.trim(),
        patient_email:      document.getElementById('patientEmail').value.trim(),
        service_code:       document.getElementById('serviceCode').value,
        appointment_date:   document.getElementById('appointmentDate').value,
        sessions_requested: parseInt(document.getElementById('sessionsRequested').value, 10),
        card_number:        document.getElementById('cardNumber').value.trim(),
      }),
    });
    setStatus('appointment-status', 'success', '✓ Appointment confirmed!', `Transaction: ${data.transaction_id} — redirecting…`);
    setTimeout(() => { window.location.href = `/confirmation?id=${data.id}`; }, 1200);
  } catch (err) {
    setStatus('appointment-status', 'error', 'Submission failed', err.message || 'Please try again.');
    btn.disabled = false;
    btn.textContent = 'Confirm Appointment';
  }
});
