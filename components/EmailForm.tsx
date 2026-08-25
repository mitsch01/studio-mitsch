"use client";

import type { Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import { useState } from "react";

const EmailForm = ({ locale }: { locale: Locale }) => {
  const t = getStrings(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"" | "success" | "error">("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
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
          {t.form.name}
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
          {t.form.email}
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
          {t.form.message}
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

      <div className="flex justify-center pt-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 px-12 text-sm uppercase tracking-widest hover:bg-raspberry-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t.form.sending : t.form.send}
        </button>
      </div>

      {status === "success" && (
        <p className="flex justify-center text-sm text-green-600 uppercase tracking-widest pt-8">
          {t.form.success}
        </p>
      )}
      {status === "error" && (
        <p className="flex justify-center text-sm text-raspberry uppercase tracking-widest pt-8">
          {t.form.error}
        </p>
      )}
    </form>
  );
};

export default EmailForm;
