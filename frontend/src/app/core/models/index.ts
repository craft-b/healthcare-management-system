export type Role = 'PATIENT' | 'PROVIDER' | 'ADMIN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'CLAIM_SUBMITTED' | 'CLAIM_APPROVED' | 'CLAIM_DENIED';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: Role;
  fullName: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: Role;
  fullName: string;
  email?: string;
}

export interface PatientDto {
  id?: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  medicalHistory?: string;
  allergies?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export interface AppointmentDto {
  id?: number;
  patientId: number;
  patientName: string;
  providerId: number;
  providerName: string;
  appointmentTime: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface AppointmentRequest {
  providerId: number;
  appointmentTime: string;
  notes?: string;
}

export interface InvoiceDto {
  id?: number;
  patientId: number;
  patientName: string;
  appointmentId?: number;
  serviceDescription: string;
  amount: number;
  status: InvoiceStatus;
  insuranceClaimNumber?: string;
  issuedAt?: string;
  paidAt?: string;
}

export interface InvoiceRequest {
  patientId: number;
  appointmentId?: number;
  serviceDescription: string;
  amount: number;
}

export interface PrescriptionDto {
  id?: number;
  patientId: number;
  patientName: string;
  providerId: number;
  providerName: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  sentToPharmacy: boolean;
  createdAt?: string;
  sentAt?: string;
}

export interface PrescriptionRequest {
  patientId: number;
  medicationName: string;
  dosage: string;
  instructions: string;
}

export interface ReportDto {
  totalPatients: number;
  totalAppointments: number;
  appointmentsInPeriod: number;
  revenueInPeriod: number;
  periodStart: string;
  periodEnd: string;
}

export interface Provider {
  id: number;
  fullName: string;
}
