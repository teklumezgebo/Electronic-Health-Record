import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

function Register() {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [role, setRole] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)

    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            await api.post('/auth/register', {
                firstName,
                lastName,
                username, 
                password,
                role
            })
            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error) {
            setError('Unable to register')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label> First Name
                    <input type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
                </label>
                <label> Last Name
                    <input type="text" onChange={(e) => setLastName(e.target.value)} value={lastName}/>
                </label>
                <label> Username
                    <input type="text" onChange={(e) => setUsername(e.target.value)} value={username}/>
                </label>
                <label> Password
                    <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                </label>
                <label> Role
                    <select onChange={(e) => setRole(e.target.value)} value={role}>
                        <option value="">Select a role</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="NURSE">Nurse</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TECHNICIAN">Technician</option>
                    </select>
                </label>
                <button type="submit">Register</button>
            </form>
            {error && <p>{error}</p>}
            {success && (
                <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center' 
                    }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        textAlign: 'center' 
                    }}>
                        <p>Registration successful!</p>
                        <p>Redirecting to login...</p>
                    </div>
                </div> 
            )}
        </div>
    )
}

export default Register