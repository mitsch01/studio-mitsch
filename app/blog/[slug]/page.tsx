import { client } from '@/sanity/client'
import { PortableText } from '@portabletext/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'

type Post = {
  title: string
  excerpt: string
  publishedAt: string
  body: any[]
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await client.fetch<Post>(
    `*[_type == "post" && slug.current == $slug][0] {
      title, excerpt, publishedAt, body
    }`,
    { slug }
  )

  if (!post) notFound()

  return (
    <div>
      <Header logoColor="black" burgerColor="black" scrollBackground={true} scrollThreshold={0.05}/>
      <main className="max-w-3xl mx-auto px-8 pt-48 py-section">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : 'Unpublished'}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-12 border-l-4 border-raspberry pl-6">
            {post.excerpt}
          </p>
        )}
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} />
        </div>
      </main>
      <Footer />
    </div>
  )
}