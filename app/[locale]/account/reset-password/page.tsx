"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { getLocaleFromPath, localizedHref, type Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname) as Locale;
  const t = getStrings(locale);
  const { refetch } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        await refetch();
        setTimeout(() => router.push(localizedHref("/account/dashboard", locale)), 1500);
      } else {
        setStatus("error");
        setErrorMessage(data.error);
      }
    } catch {
      setStatus("error");
      setErrorMessage(t.account.somethingWrong);
    }
  };

  if (!token) {
    return (
      <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-md mx-auto w-full">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-6">
          {t.account.invalidLinkHeading}
        </h1>
        <p className="text-gray-600 mb-8">{t.account.invalidLinkBody}</p>
        <Link
          href={localizedHref("/account/forgot-password", locale)}
          className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
        >
          {t.account.requestNewLink}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-md mx-auto w-full">
      <h1 className="text-4xl font-bold uppercase tracking-tight mb-8">
        {t.account.resetHeading}
      </h1>

      {status === "success" ? (
        <p className="text-green-600 text-sm uppercase tracking-widest">
          {t.account.passwordUpdated}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              {t.account.newPassword}
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

          {status === "error" && (
            <p className="text-sm text-raspberry uppercase tracking-widest">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "saving" ? t.account.resetting : t.account.setNewPassword}
          </button>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </div>
  );
}