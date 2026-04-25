import type { Patient } from "../types"

function PatientCard({ patient, onClick }: { patient: Patient, onClick: () => void }) {
  const formatDOB = (dob: string) => {
    const date = new Date(dob)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatBloodType = (bt: string | null) => {
    if (!bt) return 'Unknown'
    return bt.replace('_POS', '+').replace('_NEG', '-')
  }

  const getGenderLabel = (gender: string) => {
    const map: Record<string, string> = {
      MALE: 'Male',
      FEMALE: 'Female',
      NONBINARY: 'Non-Binary',
      TRANSMTF: 'Trans F',
      TRANSFTM: 'Trans M',
    }
    return map[gender] ?? gender
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer border border-[#1e2d3d] bg-[#111820] hover:bg-[#161e28] hover:border-[#00d4ff] transition-all duration-200 rounded-lg p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center text-[#0a0e14] font-bold text-sm flex-shrink-0">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>

        {/* Name + MRN */}
        <div>
          <p className="text-[#cdd9e5] font-semibold text-sm group-hover:text-[#00d4ff] transition-colors">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="text-[#636e7b] text-xs font-mono mt-0.5">
            MRN-{String(patient.MRN).padStart(6, '0')}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="hidden md:flex items-center gap-6 text-xs">
        <div className="text-center">
          <p className="text-[#636e7b] font-mono uppercase tracking-wider mb-0.5">DOB</p>
          <p className="text-[#cdd9e5]">{formatDOB(patient.dateOfBirth)}</p>
        </div>
        <div className="text-center">
          <p className="text-[#636e7b] font-mono uppercase tracking-wider mb-0.5">Gender</p>
          <p className="text-[#cdd9e5]">{getGenderLabel(patient.gender)}</p>
        </div>
        <div className="text-center">
          <p className="text-[#636e7b] font-mono uppercase tracking-wider mb-0.5">Blood</p>
          <p className="text-[#00d4ff] font-mono font-semibold">{formatBloodType(patient.bloodType)}</p>
        </div>
      </div>

      {/* Arrow */}
      <div className="text-[#636e7b] group-hover:text-[#00d4ff] transition-colors ml-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  )
}

export default PatientCard