import { useState, useEffect, useRef } from "react";
import { initSocket, disconnectSocket, getSocket } from "@/services/socket";
import api from "@/services/api";

export interface ChatMessage {
  _id?: string;
  senderId: string;
  receiverId?: string;
  text?: string;
  image?: string;
  createdAt: string;
  status?: string;
}

export interface UserContact {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  avatar?: string;
  unread?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<UserContact[]>([]);
  const [activeContact, setActiveContact] = useState<UserContact | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // NAYA LOGIC: useRef taake socket ko baar baar reconnect na hona pare
  const activeContactRef = useRef<UserContact | null>(null);

  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profileRes = await api.get("/users/profile");
        setCurrentUserId(profileRes.data.user._id);

        const usersRes = await api.get("/users");
        const fetchedContacts = usersRes.data;

        const contactsWithLastMessage = await Promise.all(
          fetchedContacts.map(async (contact: UserContact) => {
            try {
              const historyRes = await api.get(`/chat/history/${contact._id}`);
              const msgs = historyRes.data;
              if (msgs && msgs.length > 0) {
                const lastMsg = msgs[msgs.length - 1];
                return {
                  ...contact,
                  lastMessage: lastMsg.text || "📷 Image",
                  lastMessageTime: lastMsg.createdAt,
                  unread:
                    lastMsg.senderId !== profileRes.data.user._id &&
                    lastMsg.status !== "read"
                      ? 1
                      : 0,
                };
              }
              return contact;
            } catch {
              return contact;
            }
          }),
        );

        contactsWithLastMessage.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return (
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
          );
        });

        setContacts(contactsWithLastMessage);
        if (contactsWithLastMessage.length > 0)
          setActiveContact(contactsWithLastMessage[0]);
      } catch (error) {
        console.error("Error loading chat data", error);
      }
    };
    fetchInitialData();
  }, []);

  // SOCKET LOGIC: Ab yeh sirf 1 dafa chalega [] ki wajah se
  useEffect(() => {
    const socket = initSocket();

    socket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", (newMessage) => {
      const currentActive = activeContactRef.current; // Ref se latest contact liya

      if (
        currentActive &&
        (newMessage.senderId === currentActive._id ||
          newMessage.receiverId === currentActive._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setContacts((prevContacts) =>
        prevContacts.map((contact) => {
          if (
            contact._id === newMessage.senderId ||
            contact._id === newMessage.receiverId
          ) {
            return {
              ...contact,
              lastMessage: newMessage.text || "📷 Image",
              lastMessageTime: newMessage.createdAt,
              unread:
                newMessage.senderId === contact._id &&
                (!currentActive || currentActive._id !== contact._id)
                  ? (contact.unread || 0) + 1
                  : contact.unread,
            };
          }
          return contact;
        }),
      );
    });

    socket.on("messageDelivered", ({ messageId, tempId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? { ...msg, _id: messageId, status: "delivered" }
            : msg,
        ),
      );
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("receiveMessage");
      socket.off("messageDelivered");
      disconnectSocket();
    };
  }, []); // <-- Yahan se [activeContact] hata diya gaya hai

  useEffect(() => {
    if (!activeContact) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/history/${activeContact._id}`);
        setMessages(res.data);
        setContacts((prev) =>
          prev.map((c) =>
            c._id === activeContact._id ? { ...c, unread: 0 } : c,
          ),
        );
      } catch (error) {
        console.error("Failed to load chat history", error);
      }
    };
    fetchHistory();
  }, [activeContact]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !activeContact) return;

    const tempId = Date.now().toString();
    const tempMsg = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: activeContact._id,
      text,
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, tempMsg]);
    setContacts((prev) =>
      prev.map((c) =>
        c._id === activeContact._id
          ? { ...c, lastMessage: text, lastMessageTime: tempMsg.createdAt }
          : c,
      ),
    );

    try {
      const socket = getSocket();
      if (socket)
        socket.emit("sendMessage", {
          receiverId: activeContact._id,
          text,
          tempId,
        });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const sendImage = async (base64Image: string) => {
    if (!activeContact) return;

    const tempId = Date.now().toString();
    const tempMsg = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: activeContact._id,
      image: base64Image,
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, tempMsg]);
    setContacts((prev) =>
      prev.map((c) =>
        c._id === activeContact._id
          ? {
              ...c,
              lastMessage: "📷 Image",
              lastMessageTime: tempMsg.createdAt,
            }
          : c,
      ),
    );

    try {
      const socket = getSocket();
      if (socket)
        socket.emit("sendMessage", {
          receiverId: activeContact._id,
          image: base64Image,
          text: "📷 Image",
          tempId,
        });
    } catch (error) {
      console.error("Failed to send image", error);
    }
  };

  const clearChat = () => setMessages([]);

  return {
    messages,
    contacts,
    activeContact,
    setActiveContact,
    currentUserId,
    sendMessage,
    sendImage,
    clearChat,
    onlineUsers,
  };
}
