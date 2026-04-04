import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../utils/api"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await loginUser(email, password)
      navigate("/items")
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="container">
      <div className="login-box">

        {/* LEFT */}
        <div className="left-panel">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <h2>WELCOME!</h2>
          <p>
            This Lost & Found portal for Bennett University helps students
            quickly report lost items and connect with people who have found them.
          </p>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className="title">Lost & Found</div>

          <div className="menu">
            <span style={{background:"#dbeafe", padding:"6px 16px", borderRadius:"20px"}}>Login</span>
            <Link to="/signup">Sign Up</Link>
          </div>

          <div className="signin-title">Log in</div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="signin-btn" onClick={handleLogin}>
            Log in
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login