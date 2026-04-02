import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile() {

  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem("user"))

  const [email, setEmail] = useState(currentUser?.email || "")
  const [password, setPassword] = useState(currentUser?.password || "")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPass, setShowPass] = useState(false)

  // ✅ EMAIL VALIDATION
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSave = () => {

    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields")
      return
    }

    if (!isValidEmail(email)) {
      alert("Enter a valid email")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    // ✅ update user
    const updatedUser = { email, password }
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // ✅ update items ownership
    let items = JSON.parse(localStorage.getItem("items")) || []

    items = items.map(item => {
      if (item.user === currentUser.email) {
        return { ...item, user: email }
      }
      return item
    })

    localStorage.setItem("items", JSON.stringify(items))

    alert("Profile updated successfully!")
    navigate("/items")
  }

  return (
    <div className="upload-container">

      <div className="upload-card">

        <div className="upload-header">
          Edit Profile
        </div>

        {/* EMAIL */}
        <label>Email</label>
        <input
          className="upload-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            className="upload-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              cursor: "pointer"
            }}
          >
            {showPass ? "Hide" : "Show"}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <label>Confirm Password</label>
        <input
          type={showPass ? "text" : "password"}
          className="upload-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="btn-row">

          <button className="upload-btn" onClick={handleSave}>
            Save Changes
          </button>

          <button
            className="cancel-btn"
            onClick={() => navigate("/items")}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  )
}

export default Profile