"use client";

import type { Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import { Feather } from "lucide-react";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import { localizedHref, type Locale } from "@/lib/locale";


const PlaygroundButton = ({ locale }: { locale: Locale }) => {
  const t = getStrings(locale);

  return (
    <div className="fixed z-10 md:bottom-12 md:right-12 bottom-6 right-6 animate-pulse-slow">
      <Tooltip label={t.playground.tooltip}>
        <Link className="no-underline" href={localizedHref(locale, "/playground")} aria-label={t.playground.tooltip}>
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center hover:bg-raspberry transition-colors duration-300 shadow-lg">
            <Feather size={28} className="text-white" />
          </div>
        </Link>
      </Tooltip>
    </div>
  );
};

export default PlaygroundButton;