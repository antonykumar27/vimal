import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext"; // ✅ adjust path

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const auth = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = auth?.user;
  const loading = auth?.loading;

  useEffect(() => {
    if (!user?._id) return;

    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { userId: user._id },
    });

    setSocket(socketConnection);

    // 🔥 EMIT JOIN
    socketConnection.emit("join", {
      id: user._id,
      name: user.name,
    });

    // ✅ Listen for online users
    socketConnection.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user?._id]);

  // Safely handle cases before auth is ready
  if (!auth) {
    console.warn(
      "⚠️ useAuth() returned undefined. Is AuthProvider wrapping SocketProvider?"
    );
    return <div>Loading context...</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
