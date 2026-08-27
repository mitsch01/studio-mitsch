import { NextRequest, NextResponse } from "next/server"

const USERNAME = "mitsch01"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params

  try {
    const [projectRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${USERNAME}/${name}`, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      }),
      fetch(`https://api.github.com/repos/${USERNAME}/${name}/languages`, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      }),
    ])

    if (!projectRes.ok) {
      return NextResponse.json(
        { error: "Repo not found" },
        { status: projectRes.status },
      )
    }

    const project = await projectRes.json()
    const languagesData = langRes.ok ? await langRes.json() : {}

    return NextResponse.json({
      project,
      languages: Object.keys(languagesData),
    })
  } catch (error) {
    console.error("GitHub repo detail fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
