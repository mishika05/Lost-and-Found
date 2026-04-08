import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { signupUser } from "../utils/api"

function Signup() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const isValidEmail = (email) => {
  return /@bennett\.edu\.in$/.test(email)
  }
  


  const handleSignup = async () => {
    try {
      await signupUser(name, email, password)
      navigate("/items")
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">

        <div className="signup-icon">👤</div>

        <h2>Create Account</h2>

        <input
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

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