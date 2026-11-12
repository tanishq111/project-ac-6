import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const AppLayout = () => {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    const heading = mainRef.current?.querySelector("h1");
    document.title = `${heading?.textContent ?? "Tasks"} | Task Studio`;
    heading?.focus();
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;