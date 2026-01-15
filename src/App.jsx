import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import './App.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RegistroAuto from './pages/RegistroAuto'
import HistorialCliente from './pages/HistorialCliente'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/historial" element={<HistorialCliente />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registro-auto" element={<RegistroAuto />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
