import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function ItemDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  const currentUser = JSON.parse(localStorage.getItem("user"))

  // LOAD DATA
  const loadData = () => {
    const items = JSON.parse(localStorage.getItem("items")) || []
    const chats = JSON.parse(localStorage.getItem("chats")) || {}

    setItem(items[id])
    setMessages(chats[id] || [])
  }

  useEffect(() => {
    loadData()

    const interval = setInterval(loadData, 2000) // auto refresh
    return () => clearInterval(interval)

  }, [id])

  // SEND MESSAGE
  const sendMessage = () => {
    if (!text) return

    const chats = JSON.parse(localStorage.getItem("chats")) || {}

    const newMsg = {
      sender: currentUser?.email,
      text,
      time: new Date().toLocaleString()
    }

    const updated = [...(chats[id] || []), newMsg]

    chats[id] = updated
    localStorage.setItem("chats", JSON.stringify(chats))

    setMessages(updated)
    setText("")
  }

  // DELETE ITEM
  const deleteItem = () => {
    const items = JSON.parse(localStorage.getItem("items")) || []

    const confirmDelete = window.confirm("Delete this item?")
    if (!confirmDelete) return

    items.splice(id, 1)
    localStorage.setItem("items", JSON.stringify(items))

    alert("Item deleted!")
    navigate("/items")
  }

  if (!item) return <div>Loading...</div>

  const isOwner =
    currentUser &&
    item.user &&
    currentUser.email === item.user

  return (
    <div className="details-container">

      <p className="back-btn" onClick={() => navigate("/items")}>
        ← Back to All Items
      </p>

      <div className="details-grid">

        {/* LEFT */}
        <div className="details-card">

          <div className="item-category-pill">{item.category}</div>

          <img src={item.image || "https://cdn-icons-png.flaticon.com/512/679/679720.png"} />

          <h2>{item.name}</h2>

          <p><b>📍 Location:</b> {item.location}</p>
          <p><b>📅 Date Found:</b> {item.date}</p>
          <p><b>👤 Posted by:</b> {item.user}</p>

          <p><b>Status:</b> <span className="status">active</span></p>

          <h4>Description:</h4>
          <p>{item.desc}</p>

          {/* DELETE BUTTON */}
          {isOwner && (
            <button className="delete-btn" onClick={deleteItem}>
              Delete Item
            </button>
          )}

        </div>

        {/* RIGHT CHAT */}
        <div className="chat-card">

          <div className="chat-header">
            <h3>Message Board</h3>
            <span onClick={loadData} style={{ cursor: "pointer" }}>
              🔄 Refresh
            </span>
          </div>

          <div className="chat-box">

            {messages.length === 0 ? (
              <p style={{ color: "#999" }}>
                No messages yet. Be the first to ask about this item!
              </p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="chat-bubble">
                  <b>{msg.sender}</b>
                  <p>{msg.text}</p>
                  <small>{msg.time}</small>
                </div>
              ))
            )}

          </div>

          <div className="chat-input">
            <input
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button onClick={sendMessage}>Send</button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ItemDetails