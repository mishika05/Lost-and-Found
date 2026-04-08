import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchItem, fetchMessages, fetchConversations, sendMessage as sendMsg, deleteItem as removeItem, resolveItem, getUser, deleteMessage } from "../utils/api"


const getImageUrl = (image) => {
  if (!image) return "https://cdn-icons-png.flaticon.com/512/679/679720.png"
  if (image.startsWith("http")) return image
  return `http://localhost:5000${image}`
}
function ItemDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [selectedSender, setSelectedSender] = useState(null)
  const [text, setText] = useState("")

  const currentUser = getUser()

  const loadData = async () => {
    try {
      const itemData = await fetchItem(id)
      setItem(itemData)

      if (itemData.user === currentUser.id) {
        const convData = await fetchConversations(id)
        setConversations(convData)
      } else {
        const msgData = await fetchMessages(id)
        setMessages(msgData)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [id])

  // ✅ FIXED — owner passes selectedSender as replyTo
  const sendMessage = async () => {
    if (!text) return
    try {
      await sendMsg(id, text, isOwner ? selectedSender : null)
      setText("")
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const deleteItem = async () => {
    const confirmDelete = window.confirm("Delete this item?")
    if (!confirmDelete) return
    try {
      await removeItem(id)
      alert("Item deleted!")
      navigate("/items")
    } catch (err) {
      alert(err.message)
    }
  }

  const handleResolve = async () => {
    try {
      const updated = await resolveItem(id)
      setItem(updated)
    } catch (err) {
      alert(err.message)
    }
  }

  if (!item) return <div>Loading...</div>

  const isOwner = currentUser && item.user === currentUser.id

  const displayMessages = isOwner
    ? selectedSender
      ? conversations.find(c => c.senderId === selectedSender)?.messages || []
      : []
    : messages

  return (
    <div className="details-container">

      <p className="back-btn" onClick={() => navigate("/items")}>
        ← Back to All Items
      </p>

      <div className="details-grid">

        {/* LEFT */}
        <div className="details-card">

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div className="item-category-pill">{item.category}</div>
            {item.status === "resolved" && (
              <div style={{
                background: "#dcfce7",
                color: "#16a34a",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                ✅ Resolved
              </div>
            )}
          </div>

          <img src={getImageUrl(item.image)} alt="item" />

          <h2>{item.name}</h2>

          <p><b>📍 Location:</b> {item.location}</p>
          <p><b>📅 Date Found:</b> {item.date}</p>
          <p><b>👤 Posted by:</b> {item.userEmail}</p>
          <p><b>Status:</b> <span className="status">{item.status}</span></p>

          <h4>Description:</h4>
          <p>{item.desc}</p>

          {/* OWNER BUTTONS */}
          {isOwner && (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={handleResolve}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: item.status === "resolved" ? "#fef9c3" : "#dcfce7",
                  color: item.status === "resolved" ? "#854d0e" : "#16a34a",
                  fontWeight: "600"
                }}
              >
                {item.status === "resolved" ? "↩ Mark Active" : "✅ Mark Resolved"}
              </button>

              <button className="delete-btn" onClick={deleteItem}>
                Delete Item
              </button>
            </div>
          )}

        </div>

        {/* RIGHT CHAT */}
        <div className="chat-card">

          <div className="chat-header">
            <h3>{isOwner ? "Conversations" : "My Messages"}</h3>
            <span onClick={loadData} style={{ cursor: "pointer" }}>🔄 Refresh</span>
          </div>

          {isOwner ? (
            <div>
              {conversations.length === 0 ? (
                <p style={{ color: "#999", padding: "10px" }}>No messages yet.</p>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>

                  {/* SENDER LIST */}
                  <div style={{
                    width: "140px",
                    borderRight: "1px solid #eee",
                    paddingRight: "10px"
                  }}>
                    {conversations.map((conv) => (
                      <div
                        key={conv.senderId}
                        onClick={() => setSelectedSender(conv.senderId)}
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: selectedSender === conv.senderId ? "#dbeafe" : "transparent",
                          fontSize: "13px",
                          marginBottom: "6px"
                        }}
                      >
                        👤 {conv.senderName || conv.senderEmail}
                        <div style={{ fontSize: "11px", color: "#999" }}>
                          {conv.messages.length} msg{conv.messages.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SELECTED CHAT + REPLY */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {!selectedSender ? (
                      <p style={{ color: "#999", fontSize: "13px" }}>
                        Select a conversation to reply
                      </p>
                    ) : (
                      <>
                        <div className="chat-box">
                          {displayMessages.map((msg, i) => (
                            <div
                              key={i}
                              className="chat-bubble"
                              style={{
                                background: msg.sender === currentUser.id ? "#dbeafe" : "#f1f5f9",
                                textAlign: msg.sender === currentUser.id ? "right" : "left",
                                position: "relative"
                              }}
                            >
                              <b>{msg.senderName || msg.senderEmail}</b>
                              <p>{msg.text}</p>
                              <small>{new Date(msg.createdAt).toLocaleString()}</small>
                            
                              {/* ✅ DELETE BUTTON */}
                              {msg.sender === currentUser.id && (
                                <span
                                  onClick={async () => {
                                    if (!window.confirm("Delete this message?")) return
                                    try {
                                      await deleteMessage(msg._id)
                                      loadData()
                                    } catch (err) {
                                      alert(err.message)
                                    }
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    left: "6px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    color: "#ef4444"
                                  }}
                                >
                                  Delete
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* OWNER REPLY INPUT */}
                        <div className="chat-input" style={{ marginTop: "10px" }}>
                          <input
                            placeholder={`Reply to ${conversations.find(c => c.senderId === selectedSender)?.senderName || "user"}...`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          />
                          <button onClick={sendMessage}>Reply</button>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              )}
            </div>
          ) : (
            // NON-OWNER
            <div>
              <div className="chat-box">
                {messages.length === 0 ? (
                  <p style={{ color: "#999" }}>
                    No messages yet. Ask about this item!
                  </p>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className="chat-bubble"
                      style={{
                        background: msg.senderEmail === currentUser.email ? "#dbeafe" : "#f1f5f9",
                        textAlign: msg.senderEmail === currentUser.email ? "right" : "left",
                        position: "relative"
                      }}
                    >
                      <b>{msg.senderName || msg.senderEmail}</b>
                      <p>{msg.text}</p>
                      <small>{new Date(msg.createdAt).toLocaleString()}</small>
                    
                      {/* ✅ DELETE BUTTON — only show on your own messages */}
                      {msg.senderEmail === currentUser.email && (
                        <span
                          onClick={async () => {
                            if (!window.confirm("Delete this message?")) return
                            try {
                              await deleteMessage(msg._id)
                              loadData()
                            } catch (err) {
                              alert(err.message)
                            }
                          }}
                          style={{
                            position: "absolute",
                            top: "4px",
                            left: "6px",
                            cursor: "pointer",
                            fontSize: "11px",
                            color: "#ef4444"
                          }}
                        >
                          Delete
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="chat-input">
                <input
                  placeholder="Type your message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default ItemDetails