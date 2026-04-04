import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { fetchMessages, sendMessage as sendMsg } from "../utils/api"

function Chat() {

  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  useEffect(() => {
    fetchMessages(id)
      .then(setMessages)
      .catch(console.error)
  }, [id])

  const sendMessage = async () => {
    if (!text) return

    try {
      await sendMsg(id, text)
      setText("")
      fetchMessages(id).then(setMessages)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ padding: "40px" }}>

      <h2>Chat</h2>

      <div style={{ marginBottom: "20px" }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.senderEmail}:</b> {m.text}</p>
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