import { client } from "@/sanity/client";

export type SanityPortfolioProject = {
  id: string;
  name: string;
  title: string;
  description: string;
  html_url: string | null;
  repo_url: string | null;
  topics: string[];
  languages: string[];
  tools: string[];
  created_at: string;
  updated_at: string;
  orderRank: string;
  fork: false;
  source: "sanity";
};

// Formt jedes Sanity-Dokument auf genau die Feldnamen um, die
// RepoGallery/ProjectGallery von der GitHub-API bekommen.
const PROJECTION = `{
  "id": _id,
  "name": slug.current,
  title,
  description,
  "html_url": liveUrl,
  "repo_url": repoUrl,
  "topics": tags,
  languages,
  tools,
  "created_at": createdAt,
  "updated_at": _updatedAt,
  "orderRank": orderRank,
  "fork": false,
  "source": "sanity"
}`;

export async function getSanityProjects(): Promise<SanityPortfolioProject[]> {
  return client.fetch(
    `*[_type == "project" && isVisible == true] | order(orderRank desc) ${PROJECTION}`,
  );
}

export async function getSanityProjectBySlug(
  slug: string,
): Promise<SanityPortfolioProject | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] ${PROJECTION}`,
    { slug },
  );
}