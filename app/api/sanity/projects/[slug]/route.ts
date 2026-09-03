import { NextRequest, NextResponse } from "next/server";
import { getSanityProjectBySlug } from "@/sanity/queries/projects";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const project = await getSanityProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      project,
      languages: project.tools ?? [],
    });
  } catch (error) {
    console.error("Sanity project detail fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}