import { Link, Route, Routes } from "react-router-dom";
import { TaskProvider } from "./TaskContext.jsx";
import AppLayout from "./Layout/AppLayout.jsx";
import TasksPage from "./TasksPage.jsx";
import TaskDetailPage from "./TaskDetailPage.jsx";
import PeoplePage from "./PeoplePage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/home.jsx";

const NotFoundPage = () => {
  return (
    <>
      <h1 tabIndex={-1}>Page not found</h1>
      <Link to="/">Back to tasks</Link>
    </>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<TasksPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </TaskProvider>
  );
}