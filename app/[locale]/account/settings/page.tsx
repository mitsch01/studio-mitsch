"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, loading, refetch } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setCurrentPassword("");
        setNewPassword("");
        await refetch();
      } else {
        setStatus("error");
        setErrorMessage(data.error);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong.");
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-24 max-w-md mx-auto w-full">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-12">
          Account Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              Change Password (optional)
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
                />
              </div>
            </div>
          </div>

          {status === "error" && (
            <p className="text-sm text-raspberry uppercase tracking-widest">
              {errorMessage}
            </p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-600 uppercase tracking-widest">
              Changes saved.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <Link
          href="/account/dashboard"
          className="block mt-8 text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </main>
      <Footer />
    </div>
  );
}
