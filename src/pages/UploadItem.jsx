import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { uploadItem } from "../utils/api"

function UploadItem() {

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [desc, setDesc] = useState("")
  const [imageFile, setImageFile] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async () => {

    if (!name || !category) {
      alert("Please fill required fields")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    formData.append("date", date)
    formData.append("location", location)
    formData.append("desc", desc)
    if (imageFile) formData.append("image", imageFile)

    try {
      await uploadItem(formData)
      alert("Item uploaded successfully!")
      navigate("/items")
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="upload-container">

      <div className="upload-card">

        {/* HEADER */}
        <div className="upload-header">
          Upload Lost/Found Item
        </div>

        {/* ITEM NAME */}
        <label>Item Name *</label>
        <input
          className="upload-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* CATEGORY + DATE */}
        <div className="row">

          <div className="col">
            <label>Category *</label>
            <select
              className="upload-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option>Books</option>
              <option>Accessories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>ID Card</option>
              <option>Others</option>
            </select>
          </div>

          <div className="col">
            <label>Date Found</label>
            <input
              className="upload-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

        </div>

        {/* LOCATION */}
        <label>Location</label>
        <input
          className="upload-input"
          placeholder="e.g., Library 2nd Floor, Cafeteria"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          className="upload-textarea"
          placeholder="Provide details..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>

        {/* IMAGE */}
        <label>Upload Image (Optional)</label>

        <input
          type="file"
          accept="image/*"
          className="upload-input"
          onChange={(e) => {
            const file = e.target.files[0]
            if (!file) return
            setImageFile(file)
          }}
        />

        {/* BUTTONS */}
        <div className="btn-row">

          <button className="upload-btn" onClick={handleSubmit}>
            Upload Item
          </button>

          <button
            className="cancel-btn"
            onClick={() => navigate("/items")}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  )
}

export default UploadItem