"use client";

import { useAuth } from "@/context/AuthContext";
import type { Locale } from "@/lib/locale";
import { localizedHref } from "@/lib/locale";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ locale }: { locale: Locale }) {
  const { refetch } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await refetch();
    router.push(localizedHref("/account/login", locale));
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-black hover:text-raspberry transition-colors"
      aria-label="Logout"
    >
      <LogOut size={20} />
    </button>
  );
}