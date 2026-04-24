import type { ReactNode } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

// A Wapper used for before a page is rendered to check if the user token is valid 

function ProtectedRoute({ children }: { children: ReactNode }) {
    const context = useAuth()

    if (!context.token) {
        return <Navigate to={'/login'}/>
    }

    return children
}

export default ProtectedRoute