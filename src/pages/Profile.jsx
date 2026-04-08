import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { updateProfile, getUser, logoutUser } from "../utils/api"

function Profile() {

  const navigate = useNavigate()
  const currentUser = getUser()

  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [preview, setPreview] = useState(currentUser?.profilePicture || "")
  const [removePhoto, setRemovePhoto] = useState(false)

  const isValidEmail = (email) => {
    return /@bennett\.edu\.in$/.test(email)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProfilePicFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {

    if (!name || !email) {
      alert("Name and email are required")
      return
    }

    if (!isValidEmail(email)) {
      alert("Only Bennett University email (@bennett.edu.in) is allowed")
      return
    }

    if (password && password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    if (password && password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    if (password) formData.append("password", password)
    if (profilePicFile) formData.append("profilePicture", profilePicFile)
    if (removePhoto) formData.append("removePhoto", "true")

    try {
      await updateProfile(formData)
      alert("Profile updated successfully!")
      navigate("/items")
    } catch (err) {
      alert(err.message)
    }
  }

  const handleLogout = () => {
    logoutUser()
    navigate("/")
  }

  return (
    <div className="upload-container">
      <div className="upload-card">

        <div className="upload-header">Edit Profile</div>

        {/* PROFILE PICTURE */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #dbeafe"
              }}
            />
            <label
              htmlFor="profilePic"
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                background: "#3b82f6",
                color: "white",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              ✏️
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <p style={{ marginTop: "8px", color: "#666", fontSize: "13px" }}>
            {currentUser?.email}
          </p>

          {/* REMOVE PHOTO BUTTON */}
          {preview && (
            <button
              onClick={() => {
                setPreview("")
                setProfilePicFile(null)
                setRemovePhoto(true)
              }}
              style={{
                marginTop: "8px",
                background: "#fee2e2",
                color: "#dc2626",
                border: "none",
                borderRadius: "8px",
                padding: "4px 12px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600"
              }}
            >
              🗑️ Remove Photo
            </button>
          )}
        </div>

        {/* NAME */}
        <label>Full Name</label>
        <input
          className="upload-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <label>Email</label>
        <input
          className="upload-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <label>New Password <span style={{ color: "#999", fontSize: "12px" }}>(leave blank to keep current)</span></label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            className="upload-input"
            value={password}
            placeholder="Enter new password..."
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
        <label>Confirm New Password</label>
        <input
          type={showPass ? "text" : "password"}
          className="upload-input"
          value={confirmPassword}
          placeholder="Confirm new password..."
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="btn-row">
          <button className="upload-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button className="cancel-btn" onClick={() => navigate("/items")}>
            Cancel
          </button>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "10px",
            background: "#fee2e2",
            color: "#dc2626",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Logout
        </button>

      </div>
    </div>
  )
}

export default Profile