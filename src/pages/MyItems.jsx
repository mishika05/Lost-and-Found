import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchMyItems, logoutUser, getUser, resolveItem } from "../utils/api"

function MyItems() {

  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState("active")
  const navigate = useNavigate()

  const currentUser = getUser()

  const loadItems = () => {
    fetchMyItems()
      .then(setItems)
      .catch(console.error)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const logout = () => {
    logoutUser()
    navigate("/")
  }

  const handleResolve = async (itemId) => {
    try {
      await resolveItem(itemId)
      loadItems()
    } catch (err) {
      alert(err.message)
    }
  }

  const activeItems = items.filter(item => item.status !== "resolved")
  const resolvedItems = items.filter(item => item.status === "resolved")
  const displayItems = activeTab === "active" ? activeItems : resolvedItems

  return (
    <div>

      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="logo">Lost & Found</h2>

        <div className="nav-links">
          <span onClick={() => navigate("/items")}>Dashboard</span>
          <span onClick={() => navigate("/upload")}>Upload Item</span>
          <span onClick={() => navigate("/my-items")}>My Items</span>
          <span className="user">👤 {currentUser?.name || currentUser?.email}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="items-container">

        <h2 className="items-count">
          My Items: <span>{items.length}</span>
        </h2>

        {/* TABS */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button
            onClick={() => setActiveTab("active")}
            style={{
              padding: "8px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              background: activeTab === "active" ? "#3b82f6" : "#f1f5f9",
              color: activeTab === "active" ? "white" : "#64748b"
            }}
          >
            🟢 Active ({activeItems.length})
          </button>

          <button
            onClick={() => setActiveTab("resolved")}
            style={{
              padding: "8px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              background: activeTab === "resolved" ? "#16a34a" : "#f1f5f9",
              color: activeTab === "resolved" ? "white" : "#64748b"
            }}
          >
            ✅ Resolved ({resolvedItems.length})
          </button>
        </div>

        {/* ITEMS GRID */}
        <div className="items-grid">

          {displayItems.length === 0 ? (
            <p style={{ color: "#999" }}>
              {activeTab === "active"
                ? "No active items"
                : "No resolved items yet"}
            </p>
          ) : (
            displayItems.map((item) => (
              <div key={item._id} className="item-card">

                {/* BADGES */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                  <div className="item-category">{item.category}</div>
                  {item.status === "resolved" && (
                    <div style={{
                      background: "#dcfce7",
                      color: "#16a34a",
                      padding: "2px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      ✅ Resolved
                    </div>
                  )}
                </div>

                <img
                  src={
                    item.image ||
                    "https://cdn-icons-png.flaticon.com/512/679/679720.png"
                  }
                  alt={item.name}
                  style={{
                    opacity: item.status === "resolved" ? 0.6 : 1
                  }}
                />

                <h3>{item.name}</h3>
                <p>{item.desc}</p>

                <div className="btn-group" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>

                  <button
                    className="view-btn"
                    onClick={() => navigate(`/item/${item._id}`)}
                  >
                    View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/edit/${item._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleResolve(item._id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "12px",
                      background: item.status === "resolved" ? "#fef9c3" : "#dcfce7",
                      color: item.status === "resolved" ? "#854d0e" : "#16a34a"
                    }}
                  >
                    {item.status === "resolved" ? "↩ Reopen" : "✅ Resolve"}
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  )
}

export default MyItems