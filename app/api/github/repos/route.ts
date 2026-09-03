import { NextResponse } from "next/server"

const USERNAME = "mitsch01"

// Server-side only: GITHUB_TOKEN never reaches the browser bundle here,
// unlike the old NEXT_PUBLIC_GITHUB_TOKEN approach.
export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 300 }, // repo list rarely changes; cache 5 min
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: "GitHub API error" },
        { status: res.status },
      )
    }

    const data = await res.json()
    const repos = Array.isArray(data)
      ? data
        .filter(
          (repo: { fork: boolean; topics?: string[] }) =>
            !repo.fork && repo.topics?.includes("portfolio"),
        )
        .map((repo) => ({ ...repo, source: "github" as const }))
      : [];

    return NextResponse.json(repos)
  } catch (error) {
    console.error("GitHub repos fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
