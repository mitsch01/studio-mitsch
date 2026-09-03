"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import ProjectGallery from "@/components/ProjectGallery";
import { useDarkCursor } from "@/hooks/useDarkCursor";
import type { Locale } from "@/lib/locale";
import { renderInlineMarkdown } from "@/lib/renderInlineMarkdown";
import { getStrings } from "@/lib/strings";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Repo = {
  id: number | string;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  fork: boolean;
  source: "github" | "sanity";
};

type Project = {
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  source: "github" | "sanity";
};

const transformString = (input: string) =>
  input
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// NEW: Skeleton card — matches card dimensions exactly
function SkeletonCard() {
  return <div className="w-full h-[305px] bg-gray-200 animate-pulse" />;
}

export default function PortfolioGallery({ locale }: { locale: Locale }) {
  const t = getStrings(locale);

  useDarkCursor();

  const [repos, setRepos] = useState<Repo[]>([]);
  const [visibleRepos, setVisibleRepos] = useState(4);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const [githubRes, sanityRes] = await Promise.all([
          fetch("/api/github/repos"),
          fetch("/api/sanity/projects"),
        ]);

        const githubRepos = githubRes.ok ? await githubRes.json() : [];
        const sanityProjects = sanityRes.ok ? await sanityRes.json() : [];

        const combined = [
          ...(Array.isArray(githubRepos) ? githubRepos : []),
          ...(Array.isArray(sanityProjects) ? sanityProjects : []),
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setRepos(combined);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };
    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const openProject = async (repo: Repo) => {
    const endpoint =
      repo.source === "sanity"
        ? `/api/sanity/projects/${repo.name}`
        : `/api/github/repos/${repo.name}`;

    const res = await fetch(endpoint);
    if (!res.ok) return;

    const { project, languages } = await res.json();
    setLanguages(languages);
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  };

  const closeProject = () => {
    setSelectedProject(null);
    setLanguages([]);
    document.body.style.overflow = "";
  };

  return (
    <ErrorBoundary
      fallback={
        <p className="text-gray-400 text-sm uppercase tracking-widest py-8">
          {t.projects.unavailable}
        </p>
      }
    >
      {/* NEW: Skeleton grid shown while loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {repos.slice(0, visibleRepos).map((repo, index) => (
              <button
                key={`${repo.source}-${repo.name}`}
                onClick={() => openProject(repo)}
                className="w-full flex flex-col overflow-hidden transition-transform duration-100 hover:scale-105 hover:rounded shadow-xl group text-left"
              >
                <div className="w-full h-[305px] relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/images/${repo.name}-preview.webp`} alt={`${repo.name} preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-90 transition-opacity duration-300 flex items-center justify-center">
                    <h2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-hind md:text-base text-sm uppercase tracking-widest">
                      {transformString(repo.name)}
                    </h2>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Load More */}
          {visibleRepos < repos.length && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleRepos((prev) => prev + 4)}
                className="md:text-base text-sm w-44 uppercase bg-black text-white p-4 hover:bg-gray-800 my-12"
              >
                {t.projects.loadMore}
              </button>
            </div>
          )}
        </>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 md:p-16"
            onClick={closeProject}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-black rounded-2xl overflow-y-auto max-h-[90vh] w-full max-w-4xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeProject}
                className="absolute top-6 right-6 text-white/60 hover:text-white text-4xl leading-none z-10 transition-colors"
                aria-label={t.projects.close}
              >
                &times;
              </button>

              <div className="pt-16 pb-12 px-8 md:px-12">
                <h1 className="text-4xl md:text-5xl font-bold uppercase text-white mb-4">
                  {transformString(selectedProject.name)}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed mb-10">
                  {renderInlineMarkdown(selectedProject.description || t.projects.noDescription)}
                </p>

                <ProjectGallery projectName={selectedProject.name} />

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mt-10">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-bold uppercase tracking-wider text-white">
                        {selectedProject.source === "github" ? t.projects.languages : t.projects.tools}{" "}
                      </span>
                      {languages.join(", ")}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-bold uppercase tracking-wider text-white">
                        {t.projects.tags}:{" "}
                      </span>
                      {selectedProject.topics?.length > 0
                        ? selectedProject.topics.join(", ")
                        : t.projects.none}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-bold uppercase tracking-wider text-white">
                        {t.projects.created}:{" "}
                      </span>
                      {new Date(selectedProject.created_at).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-bold uppercase tracking-wider text-white">
                        {t.projects.updated}:{" "}
                      </span>
                      {new Date(
                        selectedProject.updated_at,
                      ).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <a

                    href={selectedProject.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold uppercase tracking-widest text-white hover:text-raspberry transition-colors"
                    aria-label={
                      selectedProject.source === "github"
                        ? t.projects.viewOnGitHub
                        : t.projects.viewProject
                    }
                  >
                    {selectedProject.source === "github"
                      ? t.projects.viewOnGitHub
                      : t.projects.viewProject}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
