"use client";

import type { Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const OTHER_SERVICE = "other";

type ServiceOption = { id: string; title: string };

const EmailForm = ({
  locale,
  services = [],
  defaultService = "",
}: {
  locale: Locale;
  services?: ServiceOption[];
  defaultService?: string;
}) => {
  const t = getStrings(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(defaultService);
  const [message, setMessage] = useState("");

  // The email gets the readable package name, not the Sanity id
  const serviceLabel =
    service === OTHER_SERVICE
      ? t.form.serviceOther
      : services.find((s) => s.id === service)?.title ?? "";
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
        body: JSON.stringify({ name, email, service: serviceLabel, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setService("");
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

      {services.length > 0 && (
        <div>
          <label htmlFor="service" className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
            {t.form.service}
          </label>
          <div className="relative">
            <select
              id="service"
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="block w-full p-3 pr-12 appearance-none border border-black bg-white rounded-none focus:outline-none focus:border-raspberry transition-colors"
            >
              <option value="">{t.form.servicePlaceholder}</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
              <option value={OTHER_SERVICE}>{t.form.serviceOther}</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black"
              aria-hidden
            />
          </div>
        </div>
      )}

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
