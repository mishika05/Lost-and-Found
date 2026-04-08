const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const Item = require("../models/Item")
const protect = require("../middleware/protect")

// Multer config — save to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})
const upload = multer({ storage })

// GET /api/items — get all items (with optional search & category filter)
// GET /api/items — get all items (with optional search & category filter)
router.get("/", protect, async (req, res) => {
  try {
    const { search, category, type, sort } = req.query

    let filter = { status: { $ne: "resolved" } }

    if (search) filter.name = { $regex: search, $options: "i" }
    if (category && category !== "All") filter.category = category
    if (type && type !== "All") filter.type = type

    // ✅ sort options
    let sortOption = { createdAt: -1 } // default: newest first
    if (sort === "oldest") sortOption = { createdAt: 1 }
    if (sort === "az") sortOption = { name: 1 }
    if (sort === "za") sortOption = { name: -1 }

    const items = await Item.find(filter).sort(sortOption)
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/items/mine — get current user's items
router.get("/mine", protect, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/items/:id — get single item
router.get("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    if (!item) return res.status(404).json({ message: "Item not found" })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/items — upload new item
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, category, date, location, desc } = req.body

    if (!name || !category)
      return res.status(400).json({ message: "Name and category are required" })

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : ""

    const item = await Item.create({
      name,
      category,
      date,
      location,
      desc,
      image: imageUrl,
      user: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name || req.user.email,
    })

    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/items/:id — edit item (owner only)
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (item.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" })

    const { name, category, date, location, desc } = req.body

    item.name = name || item.name
    item.category = category || item.category
    item.date = date || item.date
    item.location = location || item.location
    item.desc = desc || item.desc

    if (req.file) {
      item.image = `/uploads/${req.file.filename}`
    }

    await item.save()
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/items/:id — delete item (owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (item.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" })

    await item.deleteOne()
    res.json({ message: "Item deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
// PATCH /api/items/:id/resolve — toggle resolved status
router.patch("/:id/resolve", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (item.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" })

    item.status = item.status === "resolved" ? "active" : "resolved"
    await item.save()

    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
module.exports = router
