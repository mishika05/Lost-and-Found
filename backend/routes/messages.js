const express = require("express")
const router = express.Router()
const Message = require("../models/Message")
const protect = require("../middleware/protect")

// GET /api/messages/:itemId — fetch messages + mark as read
router.get("/:itemId", protect, async (req, res) => {
  try {
    const Item = require("../models/Item")
    const item = await Item.findById(req.params.itemId)
    if (!item) return res.status(404).json({ message: "Item not found" })

    const isOwner = item.user.toString() === req.user.id
    const messages = await Message.find({ item: req.params.itemId }).sort({ createdAt: 1 })

    // mark messages as read by current user
    await Message.updateMany(
      {
        item: req.params.itemId,
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id }
      },
      { $addToSet: { readBy: req.user.id } }
    )

    if (isOwner) {
      return res.json(messages)
    } else {
      const myMessages = messages.filter(
        (m) =>
          m.sender.toString() === req.user.id ||
          (m.replyTo && m.replyTo.toString() === req.user.id)
      )
      return res.json(myMessages)
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/messages/:itemId/conversations — owner only grouped by sender
router.get("/:itemId/conversations", protect, async (req, res) => {
  try {
    const Item = require("../models/Item")
    const item = await Item.findById(req.params.itemId)

    if (!item) return res.status(404).json({ message: "Item not found" })
    if (item.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" })

    const messages = await Message.find({ item: req.params.itemId }).sort({ createdAt: 1 })

    // mark as read
    await Message.updateMany(
      {
        item: req.params.itemId,
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id }
      },
      { $addToSet: { readBy: req.user.id } }
    )

    const grouped = {}
    messages.forEach((m) => {
      const isOwnerMsg = m.sender.toString() === req.user.id
      if (isOwnerMsg) {
        if (m.replyTo) {
          const key = m.replyTo.toString()
          if (grouped[key]) grouped[key].messages.push(m)
        }
      } else {
        const key = m.sender.toString()
        if (!grouped[key]) {
          grouped[key] = {
            senderId: key,
            senderEmail: m.senderEmail,
            senderName: m.senderName,
            messages: [],
          }
        }
        grouped[key].messages.push(m)
      }
    })

    Object.values(grouped).forEach((conv) => {
      conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    })

    res.json(Object.values(grouped))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/messages/unread/count — get unread counts per item for current user
router.get("/unread/count", protect, async (req, res) => {
  try {
    const Item = require("../models/Item")

    // find all messages not sent by user and not read by user
    const unreadMessages = await Message.find({
      sender: { $ne: req.user.id },
      readBy: { $ne: req.user.id }
    })

    // get items where user is involved (owner or sender)
    const userItems = await Item.find({ user: req.user.id }).select("_id")
    const userItemIds = userItems.map(i => i._id.toString())

    // count unread per item
    const counts = {}
    unreadMessages.forEach((m) => {
      const itemId = m.item.toString()

      // owner gets notified of all messages on their items
      // non-owner gets notified of replies directed to them
      const isRelevant =
        userItemIds.includes(itemId) || // owner
        (m.replyTo && m.replyTo.toString() === req.user.id) // reply to them

      if (isRelevant) {
        counts[itemId] = (counts[itemId] || 0) + 1
      }
    })

    res.json(counts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/messages/:itemId — send message
router.post("/:itemId", protect, async (req, res) => {
  try {
    const { text, replyTo } = req.body
    if (!text) return res.status(400).json({ message: "Message is empty" })

    const User = require("../models/User")
    const user = await User.findById(req.user.id)

    const message = await Message.create({
      item: req.params.itemId,
      sender: req.user.id,
      senderEmail: req.user.email,
      senderName: user?.name || req.user.email,
      text,
      replyTo: replyTo || null,
      readBy: [req.user.id], // sender has already read their own message
    })

    res.status(201).json(message)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router