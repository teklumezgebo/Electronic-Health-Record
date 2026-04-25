import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
      } />
        <Route path='/patients/:id' element={
          <ProtectedRoute>
            <div>Patient Chart</div>
          </ProtectedRoute>
      } />
        <Route path='/' element={<div>Redirect to login</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App