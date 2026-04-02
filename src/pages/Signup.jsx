import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Signup() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = () => {
    let users = JSON.parse(localStorage.getItem("users")) || []

    const exists = users.find(u => u.email === email)

    if (exists) {
      alert("User already exists")
      return
    }

    users.push({ email, password })
    localStorage.setItem("users", JSON.stringify(users))

    alert("Account created!")
    navigate("/")
  }

  return (
    <div className="signup-container">

      <div className="signup-card">

        <div className="signup-icon">👤</div>

        <h2>Create Account</h2>

        <input placeholder="Full Name" />

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="create-btn" onClick={handleSignup}>
          Create Account
        </button>

        <p style={{ marginTop: "15px" }}>
          Already have an account? <Link to="/">Log in</Link>
        </p>

      </div>
    </div>
  )
}

export default Signup