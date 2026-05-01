import uuid
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from sqlalchemy.orm import Session
from models import Base, Department, Appointment
from database import engine, SessionLocal
from dotenv import load_dotenv

load_dotenv()

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# ── DB helper ─────────────────────────────────────────────────────────────────
def get_db():
    return SessionLocal()


# ── Frontend routes (serve HTML pages) ───────────────────────────────────────
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/appointment')
def appointment():
    return render_template('appointment.html')

@app.route('/confirmation')
def confirmation():
    return render_template('confirmation.html')

@app.route('/departments')
def departments():
    return render_template('departments.html')

@app.route('/records')
def records():
    return render_template('records.html')


# ── API routes ────────────────────────────────────────────────────────────────
@app.route('/api/departments', methods=['GET'])
def get_departments():
    db = get_db()
    try:
        items = db.query(Department).all()
        return jsonify([{
            'id':                d.id,
            'code':              d.code,
            'name':              d.name,
            'description':       d.description,
            'clinician':         d.clinician,
            'fee':               float(d.fee) if d.fee else 0,
            'available_windows': d.available_windows,
        } for d in items])
    finally:
        db.close()


@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    db = get_db()
    try:
        data = request.get_json()
        transaction_id = f"TXN-{uuid.uuid4().hex[:10].upper()}"

        appt = Appointment(
            patient_name       = data['patient_name'],
            patient_email      = data['patient_email'],
            service_code       = data['service_code'],
            appointment_date   = data['appointment_date'],
            sessions_requested = data.get('sessions_requested', 1),
            transaction_id     = transaction_id,
        )
        db.add(appt)
        db.commit()
        db.refresh(appt)

        return jsonify({
            'id':                appt.id,
            'patient_name':      appt.patient_name,
            'patient_email':     appt.patient_email,
            'service_code':      appt.service_code,
            'appointment_date':  appt.appointment_date,
            'sessions_requested':appt.sessions_requested,
            'transaction_id':    appt.transaction_id,
            'created_at':        appt.created_at.isoformat() if appt.created_at else None,
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()


@app.route('/api/appointments/<int:appt_id>', methods=['GET'])
def get_appointment(appt_id):
    db = get_db()
    try:
        appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
        if not appt:
            return jsonify({'error': 'Appointment not found'}), 404
        return jsonify({
            'id':                appt.id,
            'patient_name':      appt.patient_name,
            'patient_email':     appt.patient_email,
            'service_code':      appt.service_code,
            'appointment_date':  appt.appointment_date,
            'sessions_requested':appt.sessions_requested,
            'transaction_id':    appt.transaction_id,
            'created_at':        appt.created_at.isoformat() if appt.created_at else None,
        })
    finally:
        db.close()


@app.route('/api/records', methods=['GET'])
def get_records():
    db = get_db()
    try:
        items = db.query(Appointment).order_by(Appointment.created_at.desc()).all()
        return jsonify([{
            'id':                a.id,
            'patient_name':      a.patient_name,
            'patient_email':     a.patient_email,
            'service_code':      a.service_code,
            'appointment_date':  a.appointment_date,
            'sessions_requested':a.sessions_requested,
            'transaction_id':    a.transaction_id,
            'created_at':        a.created_at.isoformat() if a.created_at else None,
        } for a in items])
    finally:
        db.close()


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)
