import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getAllBlogs, searchBlogs } from '../services/blogService'
import type { Blog } from '../services/blogService'
import BlogCard from '../components/BlogCard'
import Sidebar from '../components/Sidebar'

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBlogs, setTotalBlogs] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const category = searchParams.get('category')
  const keyword = searchParams.get('search')
  const isFiltering = Boolean(category || keyword)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setCurrentPage(1)

        if (keyword && keyword.trim() !== '') {
          const searchResults = await searchBlogs(keyword)
          const results = Array.isArray(searchResults) ? searchResults : []
          setBlogs(results)
          setTotalBlogs(results.length)
          setTotalPages(1)
        } else {
          const blogData = await getAllBlogs(category || undefined, 1, 6)
          if (blogData && Array.isArray(blogData.blogs)) {
            setBlogs(blogData.blogs)
            setTotalPages(blogData.totalPages || 1)
            setTotalBlogs(blogData.totalBlogs || blogData.blogs.length)
          } else {
            setBlogs([])
            setTotalPages(1)
            setTotalBlogs(0)
          }
        }
      } catch (error) {
        console.error(error)
        setBlogs([])
        setTotalBlogs(0)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [searchParams, keyword, category])

  const handleLoadMore = async () => {
    if (currentPage >= totalPages) return

    try {
      setLoadingMore(true)
      const nextPage = currentPage + 1
      const data = await getAllBlogs(category || undefined, nextPage, 6)

      if (data && Array.isArray(data.blogs)) {
        setBlogs((prev) => [...prev, ...data.blogs])
        setCurrentPage(nextPage)
      }
    } catch (error) {
      console.error('Lỗi tải thêm bài viết:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className='page-wrapper'>
      {/* Hero Section (only when not searching or filtering) */}
      {!isFiltering && (
        <section className='hero-section'>
          <div className='hero-content'>
            <div className='hero-badge'>
              <span className='hero-badge-dot' />
              <span>Cộng đồng Spiderum Tech</span>
            </div>
            <h1 className='hero-title'>
              Góc nhìn công nghệ & <span className='text-gradient'>kiến thức thực chiến</span>
            </h1>
            <p className='hero-subtitle'>
              Khám phá các bài viết chuyên sâu về React, Node.js, TypeScript, Architecture, Trí tuệ nhân tạo và kinh
              nghiệm phát triển sự nghiệp trong ngành phần mềm.
            </p>
            <div className='hero-stats'>
              <div className='hero-stat-item'>
                <span className='hero-stat-value'>{totalBlogs > 0 ? `${totalBlogs}+` : '30+'}</span>
                <span className='hero-stat-label'>Bài viết chọn lọc</span>
              </div>
              <div className='hero-stat-divider' />
              <div className='hero-stat-item'>
                <span className='hero-stat-value'>4</span>
                <span className='hero-stat-label'>Chủ đề cốt lõi</span>
              </div>
              <div className='hero-stat-divider' />
              <div className='hero-stat-item'>
                <span className='hero-stat-value'>100%</span>
                <span className='hero-stat-label'>Nội dung chuyên sâu</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Layout: Sidebar + Blog List */}
      <div className='main-layout'>
        <Sidebar />

        <main className='content-area'>
          {/* Header Bar */}
          <div className='content-header-bar'>
            <div>
              <h2 className='content-title'>
                {keyword
                  ? `Kết quả tìm kiếm cho: "${keyword}"`
                  : category
                    ? `Chuyên mục: ${category}`
                    : 'Bài viết mới nhất'}
              </h2>
              <span className='content-subtitle'>
                {loading
                  ? 'Đang tải dữ liệu...'
                  : `Tìm thấy ${totalBlogs} bài viết ${category ? `thuộc chủ đề ${category}` : ''}`}
              </span>
            </div>

            {isFiltering && (
              <button onClick={() => navigate('/')} className='btn btn-ghost-sm'>
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Shimmer Loading Skeleton */}
          {loading && (
            <div className='skeleton-grid'>
              {[1, 2, 3].map((n) => (
                <div key={n} className='skeleton-card'>
                  <div className='skeleton-thumb' />
                  <div className='skeleton-body'>
                    <div className='skeleton-pill' />
                    <div className='skeleton-title' />
                    <div className='skeleton-text' />
                    <div className='skeleton-text short' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && blogs.length === 0 && (
            <div className='empty-state-card'>
              <div className='empty-state-icon'>📭</div>
              <h3 className='empty-state-title'>Không tìm thấy bài viết nào phù hợp</h3>
              <p className='empty-state-desc'>
                {keyword
                  ? `Không có kết quả nào khớp với từ khóa "${keyword}". Hãy thử tìm kiếm với từ khóa khác.`
                  : 'Chưa có bài viết nào trong danh mục này. Hãy là người đầu tiên chia sẻ góc nhìn của bạn!'}
              </p>
              <div className='empty-state-actions'>
                {isFiltering ? (
                  <button onClick={() => navigate('/')} className='btn btn-secondary'>
                    Xem tất cả bài viết
                  </button>
                ) : (
                  <button onClick={() => navigate('/create')} className='btn btn-primary'>
                    ✍️ Viết bài đầu tiên
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Blog Cards List */}
          {!loading && blogs.length > 0 && (
            <div className='blog-grid'>
              {blogs.map((blog, index) => (
                <BlogCard key={blog._id} blog={blog} featured={!isFiltering && index === 0} />
              ))}
            </div>
          )}

          {/* Load More Pagination */}
          {!loading && currentPage < totalPages && (
            <div className='loadmore-container'>
              <button onClick={handleLoadMore} disabled={loadingMore} className='btn btn-secondary loadmore-btn'>
                {loadingMore ? (
                  <>
                    <span className='spinner-inline' />
                    <span>Đang tải thêm...</span>
                  </>
                ) : (
                  <>
                    <span>Xem thêm bài viết</span>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
                      <path d='M6 9l6 6 6-6' />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BlogList
