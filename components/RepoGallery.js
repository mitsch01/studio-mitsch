
"use client"

import ErrorBoundary from "@/components/ErrorBoundary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const RepoGallery = () => {
  const [repos, setRepos] = useState([]);
  const [visibleRepos, setVisibleRepos] = useState(4); // load only 4
  const username = "mitsch01";

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          },
        },
      );
      const data = await response.json();
      const filtered = data.filter(
        (repo) => !repo.fork && repo.topics?.includes("portfolio"),
      );
      setRepos(filtered);
    };
    fetchRepos();
  }, []);

  const transformString = (input) => {
    return input
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const loadMoreRepos = () => {
    setVisibleRepos((prev) => prev + 4); // load 4 more
  };

  return (
    <ErrorBoundary
      fallback={
        <p className="text-gray-400 text-sm uppercase tracking-widest py-8">
          Projects unavailable right now — check back soon.
        </p>
      }
    >
      <div className="flex flex-col">
        {/* Repo Cards */}
        <div className="clickable grid grid-cols-1 md:grid-cols-2 gap-8">
          {repos.slice(0, visibleRepos).map((repo) => (
            <Link
              href={`/project/${repo.name}`}
              key={repo.id}
              className="w-full flex flex-col overflow-hidden transition-transform duration-100 hover:scale-105 hover:rounded shadow-xl group"
            >
              {/* Top Part: Image */}
              <div className="w-full h-[305px] relative">
                <Image
                  src={`/images/${repo.name}-preview.jpg`}
                  alt={`${repo.name} header`}
                  fill
                  className="object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-90 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-hind md:text-base text-sm">
                    {transformString(repo.name)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Load More Button */}
        {visibleRepos < repos.length && (
          <div className="flex justify-center">
            <button
              onClick={loadMoreRepos}
              className="md:text-base text-sm w-44 uppercase bg-black text-white p-4 hover:bg-gray-800 my-12"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default RepoGallery;
