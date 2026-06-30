// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// const PlayButton = () => {
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     let ticking = false;

//     const handleScroll = () => {
//       if (typeof window !== "undefined" && !ticking) {
//         // Check if we're on the client side
//         window.requestAnimationFrame(() => {
//           const scrollY = window.scrollY;
//           // Calculate new scale based on scroll position
//           const newScale = Math.max(
//             0.95,
//             Math.min(1.2, 1 + Math.sin(scrollY * 0.01) * 0.1),
//           );
//           setScale(newScale);
//           ticking = false;
//         });
//         ticking = true;
//       }
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", handleScroll);
//     }

//     return () => {
//       if (typeof window !== "undefined") {
//         window.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, []);

//   return (
//     <Link href="/playground">
//       <button
//         className="fixed z-10 md:bottom-4 md:right-6 bottom-0 right-2 transition-transform duration-200"
//         aria-label="Create a poem"
//       >
//         <div
//           className="clickable relative md:w-24 md:h-24 w-18 h-18 flex items-center justify-center"
//           style={{
//             transform: `scale(${scale})`,
//             transition: "transform 0.1s ease-out",
//           }}
//         >
//           <Image
//             src="/images/create–button.png"
//             alt="Play Button"
//             width={100}
//             height={100}
//             className="absolute w-full h-full"
//           />
//         </div>
//       </button>
//     </Link>
//   );
// };

// export default PlayButton;


"use client";

import Image from "next/image";
import Link from "next/link";

const PlayButton = () => {
  return (
    <Link href="/playground">
      <button
        className="fixed z-10 md:bottom-4 md:right-6 bottom-0 right-2"
        aria-label="Create a poem"
      >
        <div className="clickable relative md:w-24 md:h-24 w-18 h-18 flex items-center justify-center animate-pulse-slow">
          <Image
            src="/images/create–button.png"
            alt="Play Button"
            width={100}
            height={100}
            className="absolute w-full h-full"
          />
        </div>
      </button>
    </Link>
  );
};

export default PlayButton;