import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<div>Login</div>} />
        <Route path='/register' element={<div>Register</div>} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <div>Dashboard</div>
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
