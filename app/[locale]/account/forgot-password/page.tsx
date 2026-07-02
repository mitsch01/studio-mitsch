"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getLocaleFromPath, localizedHref, type Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname) as Locale;
  const t = getStrings(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-md mx-auto w-full">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">
          {t.account.forgotHeading}
        </h1>

        {status === "sent" ? (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              {t.account.resetSent}
            </p>
            <Link
              href={localizedHref("/account/login", locale)}
              className="block text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
            >
              {t.account.backToLogin}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 leading-relaxed mb-8">
              {locale === "de"
                ? "Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
                  {t.account.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-raspberry uppercase tracking-widest">
                  {t.account.somethingWrong}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? t.account.sending : t.account.sendResetLink}
              </button>
            </form>

            <Link
              href={localizedHref("/account/login", locale)}
              className="block mt-8 text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
            >
              {t.account.backToLogin}
            </Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}