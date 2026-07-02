"use client";

import Header from "@/components/Header";
import PlaygroundLayout from "@/components/PlaygroundLayout";
import { useDarkCursor } from "@/hooks/useDarkCursor";
import { localizedHref, type Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Haiku = { haiku: string };

type Position = { top: number; left: number };

export default function Playground({ locale }: { locale: Locale }) {
  const t = getStrings(locale);

  useDarkCursor();

  const [haikus, setHaikus] = useState<Haiku[]>([]);
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [currentMachine, setCurrentMachine] = useState<
    "initial" | "animating" | "final"
  >("initial");
  const [newHaiku, setNewHaiku] = useState("");
  const [loading, setLoading] = useState(false);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const fixedPositions = [
    { top: 480, left: 200 },
    { top: 565, left: 550 },
    { top: 610, left: 860 },
    { top: 450, left: 1250 },
    { top: 550, left: 1600 },
    { top: 800, left: 1400 },
    { top: 900, left: 770 },
    { top: 1050, left: 750 },
    { top: 1100, left: 1600 },
    { top: 800, left: 600 },
    { top: 1350, left: 1100 },
    { top: 1350, left: 1500 },
    { top: 1350, left: 600 },
    { top: 1250, left: 1300 },
    { top: 750, left: 1600 },
    { top: 620, left: 1200 },
    { top: 950, left: 1400 },
    { top: 1100, left: 1300 },
    { top: 1150, left: 600 },
    { top: 1150, left: 1000 },
  ];

  const fixedRotations = [
    -5, -3, 7, -5, 2, -2, 4, -4, 1, -1, 3, -6, 8, -8, 6, -7, 9, -9, 0, 4,
  ];

  const handleClick = async () => {
    if (!word1.trim() || !word2.trim() || !word3.trim()) {
      return;
    }

    setCurrentMachine("animating");

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    await generateHaiku();
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && word1 && word2 && word3) {
      e.preventDefault();
      await handleClick();
    }
  };

  useEffect(() => {
    async function fetchHaikus() {
      const res = await fetch("/api/save-haiku");
      const data = await res.json();

      if (data.length > 20) {
        setHaikus(data.slice(-20));
      } else {
        setHaikus(data);
      }
    }

    fetchHaikus();
  }, []);

  const generateHaiku = async () => {
    if (!word1.trim() || !word2.trim() || !word3.trim()) return;

    setLoading(true);
    const newPrompt = `${word1} ${word2} ${word3}`;

    const haikuRes = await fetch("/api/generate-haiku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: newPrompt }),
    });

    const haikuData = await haikuRes.json();

    if (haikuRes.ok) {
      const generatedHaiku = haikuData.haiku;
      setNewHaiku(generatedHaiku);
      setCurrentMachine("final");
      setHaikus((prevHaikus) => [...prevHaikus, { haiku: newHaiku }]);

      await fetch("/api/save-haiku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ haiku: generatedHaiku }),
      });
    } else {
      setNewHaiku(t.playground.errorGenerating);
      setCurrentMachine("initial");
    }

    setLoading(false);
  };

  const startDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLButtonElement
    )
      return;
    setIsDragging(true);
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setStartX(clientX);
    setStartY(clientY);
  };

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) return;
    const dragContainer = dragContainerRef.current;
    if (!dragContainer) return;

    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    dragContainer.style.left = `${dragContainer.offsetLeft + deltaX}px`;
    dragContainer.style.top = `${dragContainer.offsetTop + deltaY}px`;

    setStartX(currentX);
    setStartY(currentY);
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const reloadHaiku = () => {
    setCurrentMachine("initial");
    setNewHaiku("");
    setWord1("");
    setWord2("");
    setWord3("");
  };

  // Force black background to prevent white overscroll flash
  useEffect(() => {
    document.body.style.backgroundColor = "black";
    document.documentElement.style.backgroundColor = "black";
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  // Center the machine in the viewport on mount
  useEffect(() => {
    if (!machineRef.current) return;

    const rect = machineRef.current.getBoundingClientRect();
    const scrollX =
      window.scrollX + rect.left - window.innerWidth / 2 + rect.width / 2;
    const scrollY =
      window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;

    window.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: "instant",
    });
  }, []);

  return (
    <PlaygroundLayout isBlackBackground={true} showFooter={false}>
      <Header
        logoColor="white"
        burgerColor="white"
        scrollBackground={false}
        scrollThreshold={1}
      />

      {/* Mobile placeholder */}
      <div className="flex md:hidden flex-col items-center justify-center h-screen bg-black px-8 text-center gap-6">
        <p className="font-homemade text-raspberry text-4xl">_mitsch</p>
        <h1 className="font-cooperhewitt text-white text-2xl uppercase tracking-widest">
          {t.playground.mobileHeading}
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          {t.playground.mobileBody}
        </p>
        <a
          href={localizedHref("/", locale)}
          className="text-xs uppercase tracking-widest font-bold text-white border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
        >
          {t.playground.backToHome}
        </a>
      </div>

      {/* Desktop — full playground */}
      <div
        className="hidden md:block scale-90 overflow-hidden relative"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        ref={dragContainerRef}
        onMouseMove={handleDrag}
        onMouseUp={stopDrag}
        onTouchMove={handleDrag}
        onTouchEnd={stopDrag}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          position: "absolute",
          backgroundColor: "black",
        }}
      >
        <div className="scale-90 absolute w-full h-full z-30">
          <div className="flex flex-col items-center justify-center">
            <div className="relative" style={{ padding: 0, margin: 0 }}>
              <div className="relative" style={{ padding: 0, margin: 0 }}>
                <div
                  ref={machineRef}
                  className="relative"
                  style={{
                    top: `${fixedPositions[0].top * 2.5}px`,
                    left: `${fixedPositions[0].left * 1.5}px`,
                  }}
                >
                  <h2 className="font-cooperhewitt text-white text-5xl mt-48 -mb-20 text-center">
                    {t.playground.generatorHeading}
                  </h2>
                  {currentMachine === "initial" && (
                    <Image
                      src="/images/poem-machine-without-poem.png"
                      alt="Machine"
                      width={800}
                      height={555}
                      className="w-[800px] h-[555px] object-cover block"
                      onClick={handleClick}
                    />
                  )}
                  {currentMachine === "initial" && (
                    <button
                      className="absolute top-44 right-4 w-12 h-12 bg-raspberry hover:bg-[#a3144f] rounded-full z-20 flex items-center justify-center text-white font-bold"
                      onClick={handleClick}
                    ></button>
                  )}
                  {currentMachine === "animating" && (
                    <Image
                      src="/videos/poem-machine-animation.png"
                      alt="Generating"
                      width={800}
                      height={555}
                      className="w-[800px] h-[555px] object-cover block"
                    />
                  )}
                  {currentMachine === "final" && (
                    <Image
                      src="/images/poem-machine-with-poem.png"
                      alt="Final Machine"
                      width={800}
                      height={555}
                      className="w-[800px] h-[555px] object-cover block"
                    />
                  )}
                  {currentMachine === "final" ? (
                    <pre className="absolute top-32 -left-32 p-4 text-white font-grace tracking-wider text-center text-2xl border-raspberry border-4">
                      {newHaiku}
                    </pre>
                  ) : (
                    <div className="absolute flex flex-col top-24 p-4 w-72 z-30">
                      <input
                        type="text"
                        value={word1}
                        onChange={(e) => setWord1(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="p-2 mb-2 uppercase"
                        placeholder="First noun (EN)"
                      />
                      <input
                        type="text"
                        value={word2}
                        onChange={(e) => setWord2(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="p-2 mb-2 uppercase"
                        placeholder="Second noun (EN)"
                      />
                      <input
                        type="text"
                        value={word3}
                        onChange={(e) => setWord3(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="p-2 uppercase"
                        placeholder="Third noun (EN)"
                      />
                    </div>
                  )}

                  <div className="absolute max-w-96 right-0">
                    <button className="z-30" onClick={reloadHaiku}>
                      <RotateCcw className="text-white w-8 h-8" />
                    </button>
                  </div>
                  <div className="absolute text-white max-w-96 ml-48 mt-12">
                    <h1 className="text-xl font-bold italic">{t.playground.haikuDefinitionTitle}</h1>
                    <p className="italic text-gray-400">{t.playground.haikuDefinitionPronunciation}</p>
                    <p className="mt-2 text-justify">{t.playground.haikuDefinitionBody}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-[4000px] h-[4000px]">
          {haikus.length > 0 &&
            haikus.map((haikuItem, index) => (
              <div
                key={index}
                className="text-white"
                style={{
                  position: "absolute",
                  top: fixedPositions[index]
                    ? `${fixedPositions[index].top * 2}px`
                    : "0px",
                  left: fixedPositions[index]
                    ? `${fixedPositions[index].left * 2}px`
                    : "0px",
                  transform:
                    fixedRotations[index] !== undefined
                      ? `rotate(${fixedRotations[index]}deg)`
                      : "rotate(0deg)",
                }}
              >
                <pre className="font-grace tracking-wider text-center text-2xl">
                  {haikuItem.haiku}
                </pre>
              </div>
            ))}
          {newHaiku && (
            <div
              className="text-white p-4"
              style={{
                position: "absolute",
                top: `${fixedPositions[haikus.length % fixedPositions.length].top}px`,
                left: `${fixedPositions[haikus.length % fixedPositions.length].left}px`,
                transform: `rotate(${fixedRotations[haikus.length % fixedRotations.length]}deg)`,
              }}
            >
              <pre className="font-grace tracking-wider text-center text-2xl">
                {newHaiku}
              </pre>
            </div>
          )}
        </div>
      </div>
    </PlaygroundLayout>
  );
}
