const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const User = require("../models/User")
const protect = require("../middleware/protect")

// Multer for profile picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})
const upload = multer({ storage })

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" })

    const emailRegex = /^[^\s@]+@bennett\.edu\.in$/
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Enter a valid email address" })

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(400).json({ message: "User already exists" })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    res.status(201).json({
      message: "Account created!",
      token: generateToken(user),
      user: { id: user._id, email: user.email, name: user.name, profilePicture: user.profilePicture },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" })

    res.json({
      token: generateToken(user),
      user: { id: user._id, email: user.email, name: user.name, profilePicture: user.profilePicture },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/auth/profile (protected)
router.put("/profile", protect, upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, email, password } = req.body

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    // ✅ ADD THIS
    if (email) {
      const emailRegex = /^[^\s@]+@bennett\.edu\.in$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Only Bennett University email (@bennett.edu.in) is allowed" })
      }
    }

    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = await bcrypt.hash(password, 10)
    if (req.file) {
      user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    }
    if (req.body.removePhoto === "true") {
      user.profilePicture = ""
    }

    await user.save()

    res.json({
      message: "Profile updated!",
      token: generateToken(user),
      user: { id: user._id, email: user.email, name: user.name, profilePicture: user.profilePicture },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router