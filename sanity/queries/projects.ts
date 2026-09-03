import { client } from "@/sanity/client";

export type SanityPortfolioProject = {
  id: string;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  languages: string[];
  tools: string[];
  created_at: string;
  updated_at: string;
  fork: false;
  source: "sanity";
};

// Formt jedes Sanity-Dokument auf genau die Feldnamen um, die
// RepoGallery/ProjectGallery heute von der GitHub-API bekommen.
const PROJECTION = `{
  "id": _id,
  "name": slug.current,
  description,
  "html_url": liveUrl,
  "topics": tags,
  languages,
  tools,
  "created_at": _createdAt,
  "updated_at": _updatedAt,
  "fork": false,
  "source": "sanity"
}`;

export async function getSanityProjects(): Promise<SanityPortfolioProject[]> {
  return client.fetch(
    `*[_type == "project" && isVisible == true] | order(_createdAt desc) ${PROJECTION}`,
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