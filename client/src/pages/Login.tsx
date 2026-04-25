import { useAuth } from "../context/AuthContext"
import api from "../api/axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    const { login } =  useAuth()

    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const response = await api.post('/auth/login', { username, password })
            login(response.data.accessToken, response.data.user)
            navigate('/dashboard')
        } catch (error) {
            setError('Invalid username or password')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label> Username
                    <input type="text" onChange={(e) => setUsername(e.target.value)} value={username}/>
                </label>
                <label> Password
                    <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                </label>
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default Login