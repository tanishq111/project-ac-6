import { Navigate, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) { // this is the proof of identity check
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  }

  return (
    <section>
      <h1 tabIndex={-1}>Welcome Home</h1>
      <p>You are logged in to Task Studio.</p>

      <h2>Your Dashboard</h2>
      <p>You have 3 tasks waiting and 2 tasks completed today.</p>

      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </section>
  );
};

export default Home;