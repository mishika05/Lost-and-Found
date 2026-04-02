import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function EditItem() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items")) || []
    setItem(items[id])
  }, [id])

  const handleUpdate = () => {

    let items = JSON.parse(localStorage.getItem("items")) || []

    items[id] = item

    localStorage.setItem("items", JSON.stringify(items))

    alert("Item updated successfully!")
    navigate("/my-items")
  }

  if (!item) return <div>Loading...</div>

  return (
    <div className="upload-container">

      <div className="upload-card">

        <div className="upload-header">
          Edit Item
        </div>

        <label>Item Name</label>
        <input
          className="upload-input"
          value={item.name}
          onChange={(e) =>
            setItem({ ...item, name: e.target.value })
          }
        />

        <label>Category</label>
        <input
          className="upload-input"
          value={item.category}
          onChange={(e) =>
            setItem({ ...item, category: e.target.value })
          }
        />

        <label>Location</label>
        <input
          className="upload-input"
          value={item.location}
          onChange={(e) =>
            setItem({ ...item, location: e.target.value })
          }
        />

        <label>Description</label>
        <textarea
          className="upload-textarea"
          value={item.desc}
          onChange={(e) =>
            setItem({ ...item, desc: e.target.value })
          }
        />

        <button className="upload-btn" onClick={handleUpdate}>
          Save Changes
        </button>

      </div>
    </div>
  )
}

export default EditItem