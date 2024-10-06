import fs from "fs"
import path from "path"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const projectName = searchParams.get("projectName")
  const maxImages = parseInt(searchParams.get("maxImages"), 11) || 11

  const imagesDirectory = path.join(process.cwd(), "public", "images")
  const desktopImages = []
  const mobileImages = []

  for (let i = 1; i <= maxImages; i++) {
    const desktopImagePath = path.join(imagesDirectory, `${projectName}-desktop-${i}.jpg`)
    const mobileImagePath = path.join(imagesDirectory, `${projectName}-mobile-${i}.jpg`)

    if (fs.existsSync(desktopImagePath)) {
      desktopImages.push(`/images/${projectName}-desktop-${i}.jpg`)
    }

    if (fs.existsSync(mobileImagePath)) {
      mobileImages.push(`/images/${projectName}-mobile-${i}.jpg`)
    }
  }

  return new Response(JSON.stringify({ desktopImages, mobileImages }), { status: 200 })
}
