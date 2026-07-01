"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
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
        setTimeout(() => router.push("/account/dashboard"), 1500);
      } else {
        setStatus("error");
        setErrorMessage(data.error);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong — please try again.");
    }
  };

  if (!token) {
    return (
      <div>
        <Header />
        <main className="max-w-md mx-auto px-8 pt-48 pb-section">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-6">
            Invalid Link
          </h1>
          <p className="text-gray-600 mb-8">
            This reset link is invalid or has expired.
          </p>
          <Link
            href="/account/forgot-password"
            className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
          >
            Request a new link →
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto px-8 pt-48 pb-section">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-8">
          Reset Password
        </h1>

        {status === "success" ? (
          <p className="text-green-600 text-sm uppercase tracking-widest">
            Password updated — redirecting to your account...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
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
              {status === "saving" ? "Saving..." : "Set New Password"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
