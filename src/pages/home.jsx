import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import socket from "../api/socket.js";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userName, logout } = useContext(AuthContext);

  if (!isLoggedIn) { // this is the proof of identity check
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);


  socket.on("message", (data) => {
    console.log("Received message from server:", data);
  });


  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <section>
      <h1 tabIndex={-1}>Welcome Home</h1>
      <p>You are logged in to Task Studio.</p>

      <h2>Your Dashboard</h2>
      <p>You have 3 tasks waiting and 2 tasks completed today.</p>

    {isLoggedIn && (
      <p>Welcome, {userName}!</p>
    )}
    {isLoggedIn && (
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    )}

    <button type="button" onClick={() => socket.emit("sendMessage", "Hello from client!")}>
        Send Message
      </button>

    </section>
  );
};

export default Home;