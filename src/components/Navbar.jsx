import { Link } from "react-router-dom"

function Navbar(){
  return(
    <div className="navbar">

      <h2>Lost & Found</h2>

      <div className="nav-links">
        <Link to="/">Login</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/items">Items</Link>
      </div>

    </div>
  )
}

export default Navbar