"use client";

import Link from "next/link";
import { Feather } from "lucide-react";
import Tooltip from "@/components/Tooltip";

const PlaygroundButton = () => {
  return (
    <div className="fixed z-10 md:bottom-12 md:right-12 bottom-6 right-6 animate-pulse-slow">
      <Tooltip label="Write a poem">
        <Link href="/playground" aria-label="Write a poem">
          <div className="clickable w-16 h-16 bg-black rounded-full flex items-center justify-center hover:bg-raspberry transition-colors duration-300 shadow-lg ">
            <Feather size={28} className="text-white" />
          </div>
        </Link>
      </Tooltip>
    </div>
  );
};

export default PlaygroundButton;