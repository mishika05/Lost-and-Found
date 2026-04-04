# Lost & Found — Backend Setup Guide

## Folder Structure
```
backend/
  models/
    User.js
    Item.js
    Message.js
  routes/
    auth.js
    items.js
    messages.js
  middleware/
    protect.js
  uploads/         ← images saved here automatically
  server.js
  package.json
  .env             ← YOU CREATE THIS (see step 3)
```

---

## Step 1 — Install Node.js
Download from https://nodejs.org (LTS version)

---

## Step 2 — Install dependencies
Open terminal in the `backend/` folder and run:
```bash
npm install
```

---

## Step 3 — Set up MongoDB Atlas (free)

1. Go to https://cloud.mongodb.com and create a free account
2. Click **"Build a Database"** → choose **FREE (M0 Sandbox)**
3. Choose a region → Click **Create**
4. Set a **username** and **password** (save these!)
5. Under **Network Access** → Click **"Add IP Address"** → **"Allow Access from Anywhere"**
6. Go to **Database** → Click **Connect** → **Connect your application**
7. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/
   ```

---

## Step 4 — Create your .env file
Create a file called `.env` in the `backend/` folder:
```
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/lostandfound?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here
PORT=5000
```
Replace `youruser` and `yourpassword` with your Atlas credentials.

---

## Step 5 — Start the backend
```bash
npm run dev
```
You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

## Step 6 — Connect your React frontend

1. Copy `frontend-api-helper/api.js` into your React project at `src/utils/api.js`

2. Update each page to use the new API functions instead of localStorage:

### Login.jsx
```js
import { loginUser } from "../utils/api"

const handleLogin = async () => {
  try {
    await loginUser(email, password)
    navigate("/items")
  } catch (err) {
    alert(err.message)
  }
}
```

### Signup.jsx
```js
import { signupUser } from "../utils/api"

const handleSignup = async () => {
  try {
    await signupUser(name, email, password)
    navigate("/items")
  } catch (err) {
    alert(err.message)
  }
}
```

### ViewItems.jsx
```js
import { fetchItems } from "../utils/api"

useEffect(() => {
  fetchItems(search, selectedCategory)
    .then(setItems)
    .catch(console.error)
}, [search, selectedCategory])
```

### UploadItem.jsx
```js
import { uploadItem } from "../utils/api"

const handleSubmit = async () => {
  const formData = new FormData()
  formData.append("name", name)
  formData.append("category", category)
  formData.append("date", date)
  formData.append("location", location)
  formData.append("desc", desc)
  if (imageFile) formData.append("image", imageFile) // imageFile from input

  try {
    await uploadItem(formData)
    navigate("/items")
  } catch (err) {
    alert(err.message)
  }
}
```

### MyItems.jsx
```js
import { fetchMyItems } from "../utils/api"

useEffect(() => {
  fetchMyItems().then(setItems).catch(console.error)
}, [])
```

### ItemDetails.jsx
```js
import { fetchItem, fetchMessages, sendMessage, deleteItem } from "../utils/api"

useEffect(() => {
  fetchItem(id).then(setItem)
  fetchMessages(id).then(setMessages)
}, [id])
```

### Profile.jsx
```js
import { updateProfile } from "../utils/api"

const handleSave = async () => {
  try {
    await updateProfile(email, password)
    navigate("/items")
  } catch (err) {
    alert(err.message)
  }
}
```

---

## API Reference

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/signup | No | Register |
| POST | /api/auth/login | No | Login |
| PUT | /api/auth/profile | Yes | Update profile |
| GET | /api/items | Yes | All items |
| GET | /api/items/mine | Yes | My items |
| GET | /api/items/:id | Yes | Single item |
| POST | /api/items | Yes | Upload item |
| PUT | /api/items/:id | Yes | Edit item |
| DELETE | /api/items/:id | Yes | Delete item |
| GET | /api/messages/:itemId | Yes | Get messages |
| POST | /api/messages/:itemId | Yes | Send message |
