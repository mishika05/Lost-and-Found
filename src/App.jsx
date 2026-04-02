import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import UploadItem from "./pages/UploadItem"
import ViewItems from "./pages/ViewItems"
import Signup from "./pages/Signup"
import "./App.css"
import ItemDetails from "./pages/ItemDetails";
import MyItems from "./pages/MyItems"
import EditItem from "./pages/EditItem"
import Profile from "./pages/Profile"

// test user
if (!localStorage.getItem("users")) {
  localStorage.setItem(
    "users",
    JSON.stringify([
      { email: "test@bennett.edu.in", password: "test123" }
    ])
  )
}

const isAuth = () => localStorage.getItem("user")

const ProtectedRoute = ({ children }) => {
  return isAuth() ? children : <Navigate to="/" />
}

function App() {
  return (
    <Router>
      <Routes>

        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        <Route
  path="/edit/:id"
  element={
    <ProtectedRoute>
      <EditItem />
    </ProtectedRoute>
  }
/>

        <Route
  path="/my-items"
  element={
    <ProtectedRoute>
      <MyItems />
    </ProtectedRoute>
  }
/>
        <Route
  path="/item/:id"
  element={
    <ProtectedRoute>
      <ItemDetails />
    </ProtectedRoute>
  }
/>
        <Route
  path="/item/:id"
  element={<ProtectedRoute><ItemDetails /></ProtectedRoute>}
/>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/upload" element={
          <ProtectedRoute><UploadItem /></ProtectedRoute>
        } />

        <Route path="/items" element={
          <ProtectedRoute><ViewItems /></ProtectedRoute>
        } />

      </Routes>
    </Router>
  )
}

export default App