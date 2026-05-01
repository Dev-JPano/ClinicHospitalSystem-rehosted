async function loadConfirmation() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    setStatus('confirmation-status', 'error', 'No appointment ID', 'Please book an appointment first.');
    return;
  }
  try {
    const d = await apiFetch(`/api/appointments/${id}`);
    setStatus('confirmation-status', 'success embedded', `✓ Booking Confirmed — #${d.id}`, `Transaction ID: ${d.transaction_id}`);
    const bookedAt = d.created_at ? new Date(d.created_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
    document.getElementById('appointment-summary').innerHTML = `
      <div class="summary-row"><span>Patient Name</span><strong>${d.patient_name}</strong></div>
      <div class="summary-row"><span>Email</span><strong>${d.patient_email}</strong></div>
      <div class="summary-row"><span>Service</span><strong>${SERVICE_LABELS[d.service_code] || d.service_code}</strong></div>
      <div class="summary-row"><span>Date</span><strong>${d.appointment_date}</strong></div>
      <div class="summary-row"><span>Sessions</span><strong>${d.sessions_requested}</strong></div>
      <div class="summary-row"><span>Transaction ID</span><strong>${d.transaction_id}</strong></div>
      <div class="summary-row"><span>Booked At</span><strong>${bookedAt}</strong></div>
    `;
  } catch (err) {
    setStatus('confirmation-status', 'error', 'Failed to load appointment', err.message);
  }
}
loadConfirmation();
