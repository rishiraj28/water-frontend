import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar"
import About from "./pages/About"
import Admin from "./pages/Admin"
import Complaint from "./pages/Complaint"
import Home from "./pages/Home"
import Login from "./pages/Login"
import StayAware from "./pages/StayAware"
import { AdminAuthProvider, useAdminAuth } from "./AdminAuthContext"

function ProtectedAdmin() {
  const { credentials } = useAdminAuth()
  return credentials ? <Admin /> : <Navigate to="/Login" replace />
}

function App() {
  return (
    <AdminAuthProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/StayAware" element={<StayAware />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Admin" element={<ProtectedAdmin />} />
          <Route path="/about" element={<About />} />
          <Route path="/Register" element={<Navigate to="/complaint" replace />} />
        </Routes>
      </div>
    </AdminAuthProvider>
  )
}

export default App
