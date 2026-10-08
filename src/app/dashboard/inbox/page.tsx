"use client";

import { useChat } from "@/hooks/useChat";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function InboxPage() {
  const {
    messages,
    contacts,
    activeContact,
    setActiveContact,
    currentUserId,
    sendMessage,
    sendImage,
    clearChat,
    onlineUsers, // Yahan se nikaala
  } = useChat();

  return (
    <div className="flex h-[calc(100vh-130px)] w-full bg-surface rounded-xl shadow-sm border border-border-main overflow-hidden min-w-0 transition-colors duration-300">
      <Sidebar
        contacts={contacts}
        activeContact={activeContact}
        setActiveContact={setActiveContact}
        onlineUsers={onlineUsers} // Sidebar ko bhej diya
      />

      {activeContact ? (
        <ChatWindow
          activeContact={activeContact}
          currentUserId={currentUserId}
          messages={messages}
          onSendMessage={sendMessage}
          onSendImage={sendImage}
          onClearChat={clearChat}
          onlineUsers={onlineUsers} // ChatWindow ko bhej diya
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-muted bg-surface">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
}
