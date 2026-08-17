import { Link } from 'react-router-dom'

interface Blog {
  _id: string
  title: string
  content?: string
  likes: number
  views: number
  category?: string
  createdAt?: string
  author?: {
    username: string
  }
}

interface Props {
  blog: Blog
}

const BlogCard = ({ blog }: Props) => {
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : null

  return (
    <article className='blog-card'>
      <div className='blog-card-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {blog.category ? (
            <span className='blog-card-category'>{blog.category}</span>
          ) : (
            <span className='blog-card-category'>Chung</span>
          )}
          {blog.author && (
            <span className='blog-card-author' style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              bởi <strong style={{ color: 'var(--text-main)' }}>{blog.author.username}</strong>
            </span>
          )}
        </div>
        {formattedDate && <span className='blog-card-date'>{formattedDate}</span>}
      </div>

      <Link to={`/blog/${blog._id}`} className='blog-card-title'>
        {blog.title}
      </Link>

      {blog.content && (
        <p
          className='blog-card-excerpt'
          style={{
            fontSize: '14.5px',
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.5'
          }}
        >
          {blog.content}
        </p>
      )}

      <div className='blog-card-footer'>
        <div className='blog-card-stats'>
          <span className='blog-card-stat' title='Lượt xem'>
            👁️ {blog.views}
          </span>
          <span className='blog-card-stat' title='Lượt thích'>
            ❤️ {blog.likes}
          </span>
        </div>

        <Link to={`/blog/${blog._id}`} className='blog-card-readmore'>
          Đọc tiếp
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
    </article>
  )
}

export default BlogCard
