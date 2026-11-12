import { useEffect, useState } from "react";

const defaultUrl = import.meta.env.VITE_USERS_API_URL || "https://jsonplaceholder.typicode.com/users";

 const isUser = (user) => {
  return user !== null && typeof user === "object" &&
    Number.isInteger(user.id) && typeof user.name === "string" &&
    typeof user.email === "string";
}

export const useUsers =  (url = defaultUrl) => {
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState({ status: "loading", users: [], error: "" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadUsers = async () => {
      setResult({ status: "loading", users: [], error: "" });

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed (${response.status}).`);
        }

        const users = await response.json();
        if (!Array.isArray(users) || !users.every(isUser)) {
          throw new Error("The server returned an unexpected response.");
        }

        if (active) {
          setResult({ status: "success", users, error: "" });
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setResult({ status: "error", users: [], error: error.message });
        }
      }
    }

    loadUsers();
    return () => {
      active = false;
      controller.abort();
    };
  }, [url, retryCount]);

  const retry = () => {
    setRetryCount((currentCount) => currentCount + 1);
  }

  return { ...result, retry };
}