import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'

export async function getDownloadUrl(key: string, filename?: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
    Key: key,
    ResponseContentDisposition: filename
      ? `attachment; filename="${filename}"`
      : 'attachment',
  })
  return getSignedUrl(r2, command, { expiresIn: 604800 }) // 7 days
}