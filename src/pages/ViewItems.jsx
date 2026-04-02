import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function ViewItems() {

  const [items, setItems] = useState([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const navigate = useNavigate()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("items")) || []
    setItems(data)
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

  // ✅ FILTER LOGIC (SEARCH + CATEGORY)
  const filteredItems = items.filter(item => {

    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory

    return matchSearch && matchCategory
  })

  return (
    <div>

      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="logo">Lost & Found</h2>

        <div className="nav-links">
          <span onClick={() => navigate("/items")}>Dashboard</span>
          <span onClick={() => navigate("/upload")}>Upload Item</span>
          <span onClick={() => navigate("/my-items")}>My Items</span>

          <span
  className="user"
  onClick={() => navigate("/profile")}
  style={{ cursor: "pointer" }}
>
  👤 {JSON.parse(localStorage.getItem("user"))?.email}
</span>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="items-container">

        <h2 className="items-count">
          Found <span>{filteredItems.length}</span> Items
        </h2>

        <p className="subtitle">
          Browse through lost and found items reported by students
        </p>

        {/* SEARCH + FILTER */}
        <div className="search-bar">
          <input
            placeholder="Search items..."
            onChange={(e) => setSearch(e.target.value)}
          />

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

        {/* GRID */}
        <div className="items-grid">

          {filteredItems.map((item, i) => (
            <div key={i} className="item-card">

              <div className="item-category">
                {item.category || "Accessories"}
              </div>

              <img
                src={
                  item.image ||
                  "https://cdn-icons-png.flaticon.com/512/679/679720.png"
                }
                alt="item"
              />

              <h3>{item.name}</h3>

              <p>
                {item.desc || "No description available"}
              </p>

              <p className="location">
                📍 {item.location || "Library 2nd Floor"}
              </p>

              <button
                className="claim-btn"
                onClick={() => navigate(`/item/${i}`)}
              >
                View Details
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

export default ViewItems