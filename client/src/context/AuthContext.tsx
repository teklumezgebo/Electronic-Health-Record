import type { User } from "../types";
import { createContext, useState, useContext } from "react"
import type { ReactNode } from "react"

interface AuthContextType {
    token: string | null
    user: User | null
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({ children }: { children: ReactNode }) {
  
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    
    function login(token: string, user: User) {
        setUser(user)
        setToken(token)
        localStorage.setItem('token', token) // Stored here to persist after refreshes
        localStorage.setItem('user', JSON.stringify(user))
    }
    
    function logout() {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
        {children}
        </AuthContext.Provider>
    )   
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}