import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllBlogs, searchBlogs } from '../services/blogService'
import BlogCard from '../components/BlogCard'
import Sidebar from '../components/Sidebar'

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

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const keyword = searchParams.get('search')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setCurrentPage(1)

        let data

        if (keyword && keyword.trim() !== '') {
          data = await searchBlogs(keyword)
          if (Array.isArray(data)) {
            setBlogs(data)
          } else if (data?.data) {
            setBlogs(data.data)
          } else {
            setBlogs([])
          }
          setTotalPages(1)
        } else {
          data = await getAllBlogs(category || undefined, 1, 6)
          if (data && Array.isArray(data.blogs)) {
            setBlogs(data.blogs)
            setTotalPages(data.totalPages || 1)
          } else if (Array.isArray(data)) {
            setBlogs(data)
            setTotalPages(1)
          } else {
            setBlogs([])
            setTotalPages(1)
          }
        }
      } catch (error) {
        console.error(error)
        setBlogs([])
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
    <div className='main-layout'>
      <Sidebar />

      <main className='content-area'>
        <h1 className='content-title'>
          {keyword ? `Kết quả tìm kiếm cho: "${keyword}"` : category ? `Chủ đề: ${category}` : 'Danh sách bài viết'}
        </h1>

        {loading && (
          <div className='loading-state'>
            <div className='spinner' />
            <p>Đang tải danh sách bài viết...</p>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className='empty-state'>
            <span className='empty-state-icon'>📭</span>
            <p className='empty-state-text'>Không tìm thấy bài viết nào phù hợp.</p>
          </div>
        )}

        {!loading && blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}

        {!loading && currentPage < totalPages && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', marginBottom: '24px' }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className='btn btn-secondary'
              style={{ padding: '12px 32px' }}
            >
              {loadingMore ? 'Đang tải...' : 'Xem thêm bài viết'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default BlogList
