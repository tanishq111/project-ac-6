import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  console.log("Navbar user:",user)
  const handleLogout = () => {
    logout();
  };
  return (
    <header className="site-header">
      <Link className="brand" to="/">Task Studio</Link>
      {user && <span className="user-name">{user}</span>}
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Tasks</NavLink>
        <NavLink to="/people">People</NavLink>
        <NavLink to="/home">Home</NavLink>
        {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
        {!isLoggedIn && <NavLink to="/signup">Sign up</NavLink>}
        {isLoggedIn && <NavLink to="/login" onClick={handleLogout}>Logout</NavLink>}
      </nav>
    </header>
  );
}


export default Navbar;