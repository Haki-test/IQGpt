
"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text = input) {
    if (!text.trim() || loading) return;

    const updated = [
      ...messages,
      { role: "user" as const, content: text },
    ];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMessages([
        ...updated,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">G</div>
          <span>Goggl<span className="brand-accent">GPT</span></span>
        </div>

        <button className="new-chat" onClick={() => {
          setMessages([]);
          setInput("");
        }}>
          <span>＋</span> New conversation
        </button>

        <div className="sidebar-label">YOUR SPACE</div>
        <div className="side-note">Your conversations will appear here.</div>

        <div className="sidebar-bottom">
          <div className="avatar">G</div>
          <div>
            <strong>GogglGPT</strong>
            <small>Your AI assistant</small>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <span className="topbar-title">AI Workspace</span>
          <span className="status"><i /> Online</span>
        </header>

        <div className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>
              <div className="eyebrow">YOUR PERSONAL AI ASSISTANT</div>
              <h1>Ideas start here<span>.</span></h1>
              <p>
                Welcome to GogglGPT. Ask questions, explore ideas,
                learn something new or simply have a conversation.
              </p>

              <div className="suggestions">
                <button onClick={() => sendMessage("Explain something interesting to me.")}>
                  <span>✧</span>
                  <strong>Explore something</strong>
                  <small>Discover a fascinating topic</small>
                </button>

                <button onClick={() => sendMessage("Help me brainstorm creative ideas.")}>
                  <span>◈</span>
                  <strong>Brainstorm ideas</strong>
                  <small>Think outside the box</small>
                </button>

                <button onClick={() => sendMessage("Teach me something new today.")}>
                  <span>⌘</span>
                  <strong>Learn something</strong>
                  <small>Make learning interesting</small>
                </button>

                <button onClick={() => sendMessage("Help me write something creative.")}>
                  <span>✎</span>
                  <strong>Get creative</strong>
                  <small>Bring your ideas to life</small>
                </button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <div className={`message ${message.role}`} key={index}>
                  <div className="message-avatar">
                    {message.role === "user" ? "Y" : "G"}
                  </div>
                  <div className="message-content">
                    <strong>
                      {message.role === "user" ? "You" : "GogglGPT"}
                    </strong>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message assistant">
                  <div className="message-avatar">G</div>
                  <div className="message-content">
                    <strong>GogglGPT</strong>
                    <p className="thinking">Thinking<span>...</span></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="composer-area">
          <form className="composer" onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask GogglGPT anything..."
            />
            <button disabled={loading || !input.trim()} type="submit">
              ↑
            </button>
          </form>
          <p className="disclaimer">
            GogglGPT can make mistakes. Check important information.
          </p>
        </div>
      </section>
    </main>
  );
}
