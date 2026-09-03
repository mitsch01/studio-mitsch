import { NextResponse } from "next/server";
import { getSanityProjects } from "@/sanity/queries/projects";

export async function GET() {
  try {
    const projects = await getSanityProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Sanity projects fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}