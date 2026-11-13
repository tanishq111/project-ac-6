import { Link, Route, Routes } from "react-router-dom";
import { TaskProvider } from "./TaskContext.jsx";
import AppLayout from "./Layout/AppLayout.jsx";
import TasksPage from "./TasksPage.jsx";
import TaskDetailPage from "./TaskDetailPage.jsx";
import PeoplePage from "./PeoplePage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/home.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";


const NotFoundPage = () => {
  return (
    <>
      <h1 tabIndex={-1}>Page not found</h1>
      <Link to="/">Back to tasks</Link>
    </>
  );
}

export default function App() {
  const { isLoggedIn } = useContext(AuthContext);
  console.log("testtt",isLoggedIn);
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<TasksPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="home" element={<Home />} />
        <Route path="login" element={ isLoggedIn ? <Home /> : <Login />} />
          <Route path="signup" element={isLoggedIn ? <Home /> : <Signup />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </TaskProvider>
  );
}