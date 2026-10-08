"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChatMessage, UserContact } from "@/hooks/useChat";
import { getAvatar, getDisplayName } from "./Sidebar";

interface ChatWindowProps {
  activeContact: UserContact;
  currentUserId: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSendImage: (base64Image: string) => void;
  onClearChat: () => void;
  onlineUsers: string[];
}

const EMOJIS = [
  "😀",
  "😂",
  "🤣",
  "😊",
  "😍",
  "🥰",
  "😎",
  "🤔",
  "🙄",
  "😴",
  "👍",
  "👎",
  "👏",
  "🙌",
  "🙏",
  "🔥",
  "❤️",
  "💯",
  "🎉",
  "✨",
  "🚗",
  "🔧",
  "🛠️",
  "⚙️",
  "📱",
  "📷",
  "💡",
  "✅",
  "❌",
  "👋",
];

const getChatId = (id: string) =>
  id ? "#CW-" + id.slice(-6).toUpperCase() : "#000000";

export default function ChatWindow({
  activeContact,
  currentUserId,
  messages,
  onSendMessage,
  onSendImage,
  onClearChat,
  onlineUsers,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onSendImage(reader.result as string);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  let activeAvatarSrc = activeContact.avatar;
  if (!activeAvatarSrc || activeAvatarSrc.includes("ui-avatars.com")) {
    activeAvatarSrc = getAvatar(getDisplayName(activeContact));
  }

  const isOnline = onlineUsers.includes(activeContact._id);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface relative">
      <div className="flex items-center justify-between px-8 h-[72px] border-b border-border-subtle shrink-0">
        <div className="flex items-center">
          <h3 className="font-semibold text-text-main mr-3 text-[15px]">
            {getDisplayName(activeContact)}
          </h3>
          <span className="flex items-center text-[12px] text-text-secondary">
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOnline ? "bg-success" : "bg-gray-400"}`}
            ></span>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <div className="flex items-center space-x-4 relative">
          <span className="text-[13px] font-medium text-text-muted">
            {getChatId(activeContact._id)}
          </span>
          <button
            onClick={() => setShowChatMenu(!showChatMenu)}
            className="text-text-secondary hover:text-text-main p-1 rounded hover:bg-surface-subtle"
          >
            ⋮
          </button>
          {showChatMenu && (
            <div className="absolute right-0 top-full mt-2 bg-surface border border-border-subtle shadow-lg rounded-xl p-1.5 w-40 z-30">
              <button
                onClick={() => {
                  onClearChat();
                  setShowChatMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-error hover:bg-error/10 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                🗑️ Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 bg-surface"
      >
        {messages.length === 0 ? (
          <p className="text-center text-text-muted text-sm mt-10">
            Send a message to start conversation.
          </p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg._id || index}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div className="shrink-0 mr-3 mt-1">
                    <Image
                      src={activeAvatarSrc}
                      alt="avatar"
                      width={34}
                      height={34}
                      unoptimized
                      className="rounded-full object-cover h-[34px] w-[34px]"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  {msg.text && msg.text !== "📷 Image" && (
                    <div
                      className={`px-5 py-3 text-[13.5px] leading-relaxed shadow-sm break-words ${isMe ? "bg-primary-tint text-secondary rounded-2xl rounded-tr-sm" : "bg-surface-subtle text-text-main border border-border-subtle rounded-2xl rounded-tl-sm"}`}
                    >
                      {msg.text}
                    </div>
                  )}
                  {msg.image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-border-subtle shadow-sm bg-surface-subtle">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="max-w-[300px] w-full h-auto object-cover block"
                      />
                    </div>
                  )}
                  <span className="text-[10.5px] text-text-muted mt-1.5 mx-1 font-medium flex items-center">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isMe && (
                      <span
                        className={`ml-1 flex text-[13px] tracking-tighter ${msg.status === "read" ? "text-blue-500 font-bold" : "text-gray-400"}`}
                      >
                        {msg.status === "read" || msg.status === "delivered"
                          ? "✓✓"
                          : "✓"}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-5 bg-surface border-t border-border-subtle shrink-0 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-[85px] left-6 bg-surface border border-border-subtle shadow-xl rounded-xl p-3 w-[280px] z-50">
            <div className="grid grid-cols-6 gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-xl hover:bg-surface-subtle p-1.5 rounded flex justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2.5">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`shrink-0 transition-colors ${showEmojiPicker ? "text-primary" : "text-text-muted hover:text-text-main"}`}
          >
            <svg
              className="w-[22px] h-[22px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Send your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent border-none outline-none px-4 text-[14px] text-text-main placeholder-text-muted"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-text-muted hover:text-text-main shrink-0 mx-2"
          >
            <svg
              className="w-[22px] h-[22px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button
            onClick={handleSend}
            className="bg-secondary hover:opacity-90 text-white w-[38px] h-[38px] rounded-lg flex items-center justify-center ml-1"
          >
            <svg
              className="w-[18px] h-[18px] transform rotate-45 -mt-0.5 -ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
