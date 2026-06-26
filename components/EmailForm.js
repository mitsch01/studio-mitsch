"use client";

import { useState } from "react";

const EmailForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Email error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={sendEmail} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-raspberry text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-600 uppercase tracking-widest">
          Thank you — I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-raspberry uppercase tracking-widest">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
};

export default EmailForm;