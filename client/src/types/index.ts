export interface User {
    id: string
    firstName: string
    lastName: string
    username: string
    role: 'ADMIN' | 'NURSE' | 'DOCTOR' | 'TECHNICIAN'
    createdAt: string
    updatedAt: string
}

export interface Patient {
    id: string
    MRN: number
    firstName: string
    lastName: string
    dateOfBirth: string
    phone: string
    address: string
    weight: number
    gender: 'MALE' | 'FEMALE' | 'NONBINARY' | 'TRANSMTF' | 'TRANSFTM'
    bloodType: 'A_POS' | 'A_NEG' | 'B_POS' | 'B_NEG' | 'AB_POS' | 'AB_NEG' | 'O_POS' | 'O_NEG' | 'UNKNOWN'
    createdAt: string
    updatedAt: string
}

export interface Note {
    id: string
    noteType: 'SOAP' | 'PROGRESS' | 'DISCHARGE'
    body: string
    patientId: string
    writerId: string
    signedAt: string | null
    createdAt: string
}

export interface Diagnosis {
    id: string
    name: string
    code: string
    status: 'ACTIVE' | 'RESOLVED' | 'DISCONTINUED'
    patientId: string
    providerId: string
    createdAt: string
    updatedAt: string
}

export interface Medication {
    id: string
    name: string
    dosage: number
    frequency: 'DAILY' | 'BID' | 'TID' | 'QID' | 'Q4H' | 'Q6H' | 'Q8H' | 'Q12H' | 'QHS' | 'QOD' | 'AC' | 'PC' | 'PRN'
    status: 'ACTIVE' | 'RESOLVED' | 'DISCONTINUED'
    patientId: string
    prescriberId: string
    createdAt: string
    updatedAt: string
}

export interface Allergy {
    id: string
    allergen: string
    symptoms: string
    severity: 'MILD' | 'MODERATE' | 'SEVERE'
    patientId: string
    providerId: string
    createdAt: string
    updatedAt: string
}

export interface AuditLog {
    id: string
    userId: string
    action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE'
    resource: 'PATIENT' | 'NOTE' | 'MEDICATION' | 'ALLERGY' | 'DIAGNOSIS'
    resourceId: string
    timestamp: string
}

export interface PatientWithRelations extends Patient {
    notes: Note[]
    diagnoses: Diagnosis[]
    allergies: Allergy[]
    medications: Medication[]
}