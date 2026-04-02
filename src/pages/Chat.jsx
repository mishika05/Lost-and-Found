import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

function Chat() {

  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("chats")) || {}
    setMessages(chats[id] || [])
  }, [id])

  const sendMessage = () => {
    if (!text) return

    const chats = JSON.parse(localStorage.getItem("chats")) || {}

    const newMsg = { text, sender: "You" }

    const updated = [...(chats[id] || []), newMsg]

    chats[id] = updated
    localStorage.setItem("chats", JSON.stringify(chats))

    setMessages(updated)
    setText("")
  }

  return (
    <div style={{ padding: "40px" }}>

      <h2>Chat</h2>

      <div style={{ marginBottom: "20px" }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.sender}:</b> {m.text}</p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>

    </div>
  )
}

export default Chat