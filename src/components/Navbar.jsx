import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    return (
    <header className="site-header">
      <Link className="brand" to="/">Task Studio</Link>
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Tasks</NavLink>
        <NavLink to="/people">People</NavLink>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign up</NavLink>
      </nav>
    </header>
  );
}


export default Navbar;