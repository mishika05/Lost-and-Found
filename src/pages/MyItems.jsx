import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function MyItems() {

  const [items, setItems] = useState([])
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const allItems = JSON.parse(localStorage.getItem("items")) || []

    // ✅ FILTER ONLY USER ITEMS
    const userItems = allItems.filter(
      item => item.user === currentUser?.email
    )

    setItems(userItems)
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div>

      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="logo">Lost & Found</h2>

        <div className="nav-links">
          <span onClick={() => navigate("/items")}>Dashboard</span>
          <span onClick={() => navigate("/upload")}>Upload Item</span>
          <span onClick={() => navigate("/my-items")}>My Items</span>

          <span className="user">👤 {currentUser?.email}</span>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="items-container">

        <h2 className="items-count">
          My Items: <span>{items.length}</span>
        </h2>

        <div className="items-grid">

          {items.length === 0 ? (
            <p>No items uploaded yet</p>
          ) : (
            items.map((item, i) => (
              <div key={i} className="item-card">

                <div className="item-category">
                  {item.category}
                </div>

                <img
                  src={
                    item.image ||
                    "https://cdn-icons-png.flaticon.com/512/679/679720.png"
                  }
                />

                <h3>{item.name}</h3>

                <p>{item.desc}</p>

                <div style={{ display: "flex", gap: "10px" }}>
  
  <div className="btn-group">

  <div className="btn-group">
  <button
    className="view-btn"
    onClick={() => navigate(`/item/${i}`)}
  >
    View
  </button>

  <button
    className="edit-btn"
    onClick={() => navigate(`/edit/${i}`)}
  >
    Edit
  </button>
</div>

</div>

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