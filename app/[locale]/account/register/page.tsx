"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { getLocaleFromPath, localizedHref, type Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname) as Locale;
  const t = getStrings(locale);
  const { refetch } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await refetch();
        router.push(localizedHref("/account/dashboard", locale));
        router.refresh();
      } else {
        setError(data.error);
      }
    } catch {
      setError(t.account.somethingWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-md mx-auto w-full">
        <h1 className="text-5xl font-bold uppercase tracking-tight mb-12">
          {t.account.registerHeading}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              {t.account.name}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
          </div>

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

          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              {t.account.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">{t.account.minChars}</p>
          </div>

          {error && (
            <p className="text-sm text-raspberry uppercase tracking-widest">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.account.creatingAccount : t.account.createAccount}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          {t.account.alreadyAccount}{" "}
          <Link
            href={localizedHref("/account/login", locale)}
            className="font-bold text-black hover:text-raspberry transition-colors"
          >
            {t.account.login}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}