from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func
from database import Base

class Department(Base):
    __tablename__ = "departments"

    id                = Column(Integer, primary_key=True, index=True)
    code              = Column(String, unique=True, nullable=False)
    name              = Column(String, nullable=False)
    description       = Column(String)
    clinician         = Column(String)
    fee               = Column(Numeric(10, 2))
    available_windows = Column(String)


class Appointment(Base):
    __tablename__ = "appointments"

    id                 = Column(Integer, primary_key=True, index=True)
    patient_name       = Column(String, nullable=False)
    patient_email      = Column(String, nullable=False)
    service_code       = Column(String, nullable=False)
    appointment_date   = Column(String, nullable=False)
    sessions_requested = Column(Integer, default=1)
    transaction_id     = Column(String)
    created_at         = Column(DateTime(timezone=True), server_default=func.now())
