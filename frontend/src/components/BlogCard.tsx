import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Blog {
  _id: string
  title: string
  content?: string
  likes: number
  views: number
  category?: string
  thumbnail?: string
  createdAt?: string
  author?: {
    username: string
  }
}

interface Props {
  blog: Blog
  featured?: boolean
}

/**
 * Remove markdown syntax so card excerpt renders pure, clean plain text.
 */
const stripMarkdown = (markdown?: string): string => {
  if (!markdown) return ''
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // remove images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // keep link text
    .replace(/#{1,6}\s+/g, '') // remove headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // remove italic
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1') // remove code blocks
    .replace(/>\s+/g, '') // remove blockquotes
    .replace(/[-*+]\s+/g, '') // remove list markers
    .replace(/\d+\.\s+/g, '') // remove numbered lists
    .replace(/---|\*\*\*/g, '') // remove horizontal lines
    .replace(/\s+/g, ' ') // collapse whitespaces
    .trim()
}

const getInitials = (name?: string): string => {
  if (!name) return 'U'
  return name.slice(0, 2).toUpperCase()
}

const estimateReadingTime = (text?: string): number => {
  if (!text) return 1
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

const BlogCard = ({ blog, featured = false }: Props) => {
  const [imgFailed, setImgFailed] = useState(false)

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : null

  const cleanExcerpt = stripMarkdown(blog.content)
  const readingTime = estimateReadingTime(blog.content)
  const hasValidThumbnail = Boolean(blog.thumbnail && blog.thumbnail.trim() && !imgFailed)
  const authorName = blog.author?.username || 'Tác giả'

  return (
    <article className={`blog-card ${featured ? 'blog-card-featured' : ''}`}>
      {hasValidThumbnail && (
        <Link to={`/blog/${blog._id}`} className='blog-card-thumb-link'>
          <img
            src={blog.thumbnail!.trim()}
            alt={blog.title}
            className='blog-card-thumb-img'
            loading='lazy'
            onError={() => setImgFailed(true)}
          />
          <div className='blog-card-thumb-overlay' />
          {blog.category && <span className='blog-card-badge-floating'>{blog.category}</span>}
        </Link>
      )}

      <div className='blog-card-body'>
        <div className='blog-card-header'>
          <div className='blog-card-author-group'>
            <div className='blog-card-avatar'>{getInitials(authorName)}</div>
            <div className='blog-card-author-info'>
              <span className='blog-card-author-name'>{authorName}</span>
              <div className='blog-card-meta-line'>
                {formattedDate && <span>{formattedDate}</span>}
                <span className='meta-dot'>•</span>
                <span>{readingTime} phút đọc</span>
              </div>
            </div>
          </div>

          {!hasValidThumbnail && blog.category && <span className='blog-card-category'>{blog.category}</span>}
        </div>

        <Link to={`/blog/${blog._id}`} className='blog-card-title'>
          {blog.title}
        </Link>

        {cleanExcerpt && <p className='blog-card-excerpt'>{cleanExcerpt}</p>}

        <div className='blog-card-footer'>
          <div className='blog-card-stats'>
            <span className='blog-card-stat' title='Lượt xem'>
              <svg
                width='15'
                height='15'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
                <circle cx='12' cy='12' r='3' />
              </svg>
              {blog.views.toLocaleString()}
            </span>
            <span className='blog-card-stat' title='Lượt thích'>
              <svg
                width='15'
                height='15'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
              </svg>
              {blog.likes.toLocaleString()}
            </span>
          </div>

          <Link to={`/blog/${blog._id}`} className='blog-card-readmore'>
            <span>Đọc tiếp</span>
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M5 12h14M12 5l7 7-7 7' />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
