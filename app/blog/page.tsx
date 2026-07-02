import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { client } from '@/sanity/client'
import Link from 'next/link'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  isPublished: boolean
}

export const metadata = {
  title: 'Blog',
  description: 'Thoughts on web development, design, and the space where code meets craft — by Miriam Schwartz.',
}

export default async function BlogPage() {
const posts = await client.fetch<Post[]>(
  `*[_type == "post" && isPublished == true] | order(publishedAt desc) {
    _id, title, slug, excerpt, publishedAt
  }`,
  {},
  { cache: 'no-store' }
)

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoColor="black" burgerColor="black" />
  <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-2xl mx-auto w-full">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-16">
          Blog
        </h1>

        {posts.length === 0 ? (
          <p className="text-gray-400 uppercase tracking-widest text-sm">
            No posts yet — check back soon.
          </p>
        ) : (
          <ul className="flex flex-col gap-16">
            {posts.map((post) => (
              <li key={post._id}>
                <Link href={`/blog/${post.slug.current}`} className="group">
                  {post.publishedAt && (
  <p className="text-base uppercase tracking-widest text-gray-400 mb-2">
    {new Date(post.publishedAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}
  </p>
)}
                  <h2 className="text-3xl font-bold uppercase tracking-tight group-hover:text-raspberry transition-colors mb-3">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-sm uppercase tracking-widest font-bold text-black group-hover:text-raspberry transition-colors">
                    Read more →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  )
}