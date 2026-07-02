"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "duplicate"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 409) {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {status === "success" ? (
        <p className="text-sm uppercase tracking-widest text-green-400">
          You're in — welcome!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex">
          {" "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === "loading"}
            className="flex-1 bg-white/10 text-white text-sm px-4 py-2 placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-raspberry text-white font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-raspberry-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "duplicate" && (
        <p className="text-xs uppercase tracking-widest text-gray-400">
          You're already subscribed.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs uppercase tracking-widest text-raspberry">
          Something went wrong — try again.
        </p>
      )}
    </div>
  );
}
