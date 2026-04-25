import { useState, useEffect } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import type { Patient } from "../types"
import PatientCard from "../components/PatientCard"

function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const navigate = useNavigate()

  // On mount fetch all patients
  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await api.get('/patients')
        setPatients(response.data)
      } catch (error) {
        setError('Failed to fetch patients')
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    String(p.MRN).includes(search)
  )

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#cdd9e5]">
      {/* Top bar */}
      <div className="border-b border-[#1e2d3d] bg-[#111820] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#00d4ff] rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a0e14">
              <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 14H8v-4h8v4zm2-4v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z"/>
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide">MedChart</span>
          <span className="text-[#1e2d3d]">/</span>
          <span className="text-[#636e7b] text-sm font-mono">patients</span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login')
          }}
          className="text-xs text-[#636e7b] hover:text-[#cdd9e5] font-mono transition-colors border border-[#1e2d3d] hover:border-[#636e7b] px-3 py-1.5 rounded"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#cdd9e5] mb-1">Patient Registry</h1>
          <p className="text-sm text-[#636e7b] font-mono">{patients.length} patients on record</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636e7b]"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or MRN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111820] border border-[#1e2d3d] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#cdd9e5] placeholder-[#636e7b] font-mono focus:outline-none focus:border-[#00d4ff] transition-colors"
          />
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center gap-3 text-[#636e7b] text-sm font-mono py-8 justify-center">
            <div className="w-4 h-4 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
            Loading patients...
          </div>
        )}

        {error.length > 0 && (
          <div className="bg-[#f85149]/10 border border-[#f85149]/20 rounded-lg px-4 py-3 text-[#f85149] text-sm font-mono">
            {error}
          </div>
        )}

        {/* Patient List */}
        {!loading && (
          <div className="flex flex-col gap-2">
            {filtered.length === 0 && search.length > 0 ? (
              <p className="text-center text-[#636e7b] text-sm font-mono py-8">
                No patients found matching "{search}"
              </p>
            ) : (
              filtered.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard