import fs from "fs"
import { NextRequest } from "next/server"
import path from "path"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectName = searchParams.get("projectName")
  const maxImages = parseInt(searchParams.get("maxImages") ?? "11", 10) || 11

  const imagesDirectory = path.join(process.cwd(), "public", "images")
  const desktopImages: string[] = []
  const mobileImages: string[] = []

  for (let i = 1; i <= maxImages; i++) {
    const desktopImagePath = path.join(imagesDirectory, `${projectName}-desktop-${i}.webp`)
    const mobileImagePath = path.join(imagesDirectory, `${projectName}-mobile-${i}.webp`)

    if (fs.existsSync(desktopImagePath)) {
      desktopImages.push(`/images/${projectName}-desktop-${i}.webp`)
    }

    if (fs.existsSync(mobileImagePath)) {
      mobileImages.push(`/images/${projectName}-mobile-${i}.webp`)
    }
  }

  return new Response(JSON.stringify({ desktopImages, mobileImages }), { status: 200 })
}