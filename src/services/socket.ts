import { io, Socket } from "socket.io-client";

const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5000`;
  }

  return "http://localhost:5000";
};

const SOCKET_URL = getSocketUrl();

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    // Function dene se har connect/reconnect par taaza token padha jata hai
    auth: (cb) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      cb({ token });
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("🟢 WebSocket connected successfully to:", SOCKET_URL);
  });

  socket.on("connect_error", (error) => {
    console.error("🔴 Socket connection error:", error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};
