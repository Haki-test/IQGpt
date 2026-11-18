
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

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101010",
      color: "white",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <header style={{
        padding: "22px 30px",
        borderBottom: "1px solid #303030",
        fontSize: "23px",
        fontWeight: "bold",
      }}>
        GogglGPT
      </header>

      <section style={{
        flex: 1,
        width: "100%",
        maxWidth: "850px",
        margin: "auto",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}>
        {messages.length === 0 && (
          <h1 style={{ textAlign: "center", marginTop: "100px" }}>
            What can I help you with?
          </h1>
        )}

        {messages.map((message, index) => (
          <div key={index} style={{
            background: message.role === "user" ? "#292929" : "transparent",
            padding: "18px",
            borderRadius: "15px",
            marginBottom: "15px",
            lineHeight: 1.6,
          }}>
            <strong>{message.role === "user" ? "You" : "GogglGPT"}</strong>
            <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
          </div>
        ))}

        {loading && <p>GogglGPT is thinking...</p>}
      </section>

      <footer style={{
        width: "100%",
        maxWidth: "850px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}>
        <div style={{
          display: "flex",
          gap: "10px",
          background: "#252525",
          padding: "10px",
          borderRadius: "18px",
        }}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
            placeholder="Message GogglGPT..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              minWidth: 0,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "12px",
              padding: "12px 18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </div>
      </footer>
    </main>
  );
}
