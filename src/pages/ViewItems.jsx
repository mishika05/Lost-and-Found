import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchItems, fetchUnreadCounts, logoutUser, getUser } from "../utils/api"

const getImageUrl = (image) => {
  if (!image) return "https://cdn-icons-png.flaticon.com/512/679/679720.png"
  if (image.startsWith("http")) return image
  return `http://localhost:5000${image}`
}
function ViewItems() {

  const [items, setItems] = useState([])
  const [unreadCounts, setUnreadCounts] = useState({})
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSort, setSelectedSort] = useState("newest")

  const navigate = useNavigate()
  const currentUser = getUser()

  const loadItems = () => {
    fetchItems(search, selectedCategory, selectedSort)
      .then(setItems)
      .catch(console.error)
  }

  const loadUnread = () => {
    fetchUnreadCounts()
      .then(setUnreadCounts)
      .catch(console.error)
  }

  useEffect(() => {
    loadItems()
  }, [search, selectedCategory, selectedSort])

  useEffect(() => {
    loadUnread()
    // poll for new notifications every 5 seconds
    const interval = setInterval(loadUnread, 5000)
    return () => clearInterval(interval)
  }, [])

  const logout = () => {
    logoutUser()
    navigate("/")
  }

  return (
    <div>

      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="logo">ReturnIt</h2>
        <div className="nav-links">
          <span onClick={() => navigate("/items")}>Dashboard</span>
          <span onClick={() => navigate("/upload")}>Upload Item</span>
          <span onClick={() => navigate("/my-items")}>My Items</span>
          <span
            className="user"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            👤 {currentUser?.name || currentUser?.email}
          </span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="items-container">

        <h2 className="items-count">
          Found <span>{items.length}</span> Items
        </h2>
        <p className="subtitle">Browse through lost and found items reported by students</p>

        {/* SEARCH */}
        <div className="search-bar">
          <input
            placeholder="Search items..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTERS ROW */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>

          {/* CATEGORY FILTER */}
          <div>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "6px", fontWeight: "600" }}>Category</p>
            <div className="category-filters">
              {["All", "Accessories", "Books", "Electronics", "Clothing", "ID Card", "Others"].map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SORT */}
          <div>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "6px", fontWeight: "600" }}>Sort By</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "az", label: "A → Z" },
                { value: "za", label: "Z → A" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedSort(opt.value)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                    background: selectedSort === opt.value ? "#3b82f6" : "#f1f5f9",
                    color: selectedSort === opt.value ? "white" : "#64748b"
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* GRID */}
        <div className="items-grid">
          {items.length === 0 ? (
            <p style={{ color: "#999" }}>No items found</p>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="item-card"
                style={{ position: "relative" }}
              >

                {/* 🔴 UNREAD DOT */}
                {unreadCounts[item._id] > 0 && (
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "700",
                    zIndex: 10,
                    boxShadow: "0 2px 6px rgba(239,68,68,0.5)"
                  }}>
                    {unreadCounts[item._id] > 9 ? "9+" : unreadCounts[item._id]}
                  </div>
                )}

                <div className="item-category">{item.category}</div>

                <img src={getImageUrl(item.image)} alt="item" />

                <h3>{item.name}</h3>
                <p>{item.desc || "No description available"}</p>
                <p className="location">📍 {item.location || "Unknown"}</p>

                <button
                  className="claim-btn"
                  onClick={() => {
                    navigate(`/item/${item._id}`)
                  }}
                >
                  View Details
                </button>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default ViewItems