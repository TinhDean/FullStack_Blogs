import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getMyBlogs, deleteBlog } from '../services/blogService'
import type { Blog, BlogStats } from '../services/blogService'

const MyBlogs = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [deleteModalBlog, setDeleteModalBlog] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMyBlogs()
      setBlogs(data.blogs || [])
      setStats(data.stats || { totalBlogs: 0, totalViews: 0, totalLikes: 0 })
    } catch (err) {
      console.error('Lỗi lấy danh sách bài viết của tôi:', err)
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách bài viết. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDeleteClick = (blog: Blog) => {
    setDeleteModalBlog(blog)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModalBlog) return

    try {
      setDeleting(true)
      await deleteBlog(deleteModalBlog._id)

      // Cập nhật danh sách blogs
      const updatedBlogs = blogs.filter((b) => b._id !== deleteModalBlog._id)
      setBlogs(updatedBlogs)

      // Cập nhật stats
      if (stats) {
        setStats({
          totalBlogs: Math.max(0, stats.totalBlogs - 1),
          totalViews: Math.max(0, stats.totalViews - (deleteModalBlog.views || 0)),
          totalLikes: Math.max(0, stats.totalLikes - (deleteModalBlog.likes || 0))
        })
      }

      setDeleteModalBlog(null)
      triggerToast('Đã xóa bài viết thành công!', 'success')
    } catch (err) {
      console.error('Lỗi xóa bài viết:', err)
      triggerToast(err instanceof Error ? err.message : 'Xóa bài viết thất bại.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className='myblogs-container'>
      {/* Toast Notification */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      {/* Header */}
      <div className='myblogs-header'>
        <div>
          <h1 className='myblogs-title'>Bài viết của tôi</h1>
          <p className='myblogs-subtitle'>Quản lý các bài viết và theo dõi lượt tương tác từ độc giả</p>
        </div>
        <button onClick={() => navigate('/create')} className='btn btn-primary'>
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
            <path d='M12 5v14M5 12h14' />
          </svg>
          Viết bài mới
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='loading-state' style={{ minHeight: '40vh' }}>
          <div className='spinner' />
          <p>Đang tải danh sách bài viết...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className='alert-danger' style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={fetchBlogs} className='btn btn-secondary' style={{ padding: '6px 14px', fontSize: '13px' }}>
            Thử lại
          </button>
        </div>
      )}

      {/* Main Content (when not loading and no error) */}
      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <div className='myblogs-stats-grid'>
            <div className='myblogs-stat-card'>
              <div className='myblogs-stat-icon' style={{ backgroundColor: '#f0fdfa', color: '#0f766e' }}>
                📝
              </div>
              <div className='myblogs-stat-content'>
                <span className='myblogs-stat-label'>Tổng bài viết</span>
                <span className='myblogs-stat-value'>{stats?.totalBlogs || 0}</span>
              </div>
            </div>

            <div className='myblogs-stat-card'>
              <div className='myblogs-stat-icon' style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                👁️
              </div>
              <div className='myblogs-stat-content'>
                <span className='myblogs-stat-label'>Tổng lượt xem</span>
                <span className='myblogs-stat-value'>{stats?.totalViews || 0}</span>
              </div>
            </div>

            <div className='myblogs-stat-card'>
              <div className='myblogs-stat-icon' style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
                ❤️
              </div>
              <div className='myblogs-stat-content'>
                <span className='myblogs-stat-label'>Tổng lượt thích</span>
                <span className='myblogs-stat-value'>{stats?.totalLikes || 0}</span>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {blogs.length === 0 ? (
            <div className='myblogs-empty-card'>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>✍️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-title)', marginBottom: '8px' }}>
                Bạn chưa có bài viết nào
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '420px', margin: '0 auto 24px auto' }}>
                Hãy chia sẻ góc nhìn, kiến thức và câu chuyện của bạn với cộng đồng Spiderum ngay hôm nay!
              </p>
              <button onClick={() => navigate('/create')} className='btn btn-primary' style={{ padding: '10px 24px' }}>
                Viết bài đầu tiên
              </button>
            </div>
          ) : (
            /* Blogs List / Table */
            <div className='myblogs-list-card'>
              <div className='myblogs-table-wrapper'>
                <table className='myblogs-table'>
                  <thead>
                    <tr>
                      <th>Tiêu đề bài viết</th>
                      <th>Danh mục</th>
                      <th>Lượt xem</th>
                      <th>Lượt thích</th>
                      <th>Ngày đăng</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog._id}>
                        <td>
                          <Link to={`/blog/${blog._id}`} className='myblogs-blog-title'>
                            {blog.title}
                          </Link>
                        </td>
                        <td>
                          <span className='myblogs-category-tag'>{blog.category || 'Chưa phân loại'}</span>
                        </td>
                        <td>
                          <span className='myblogs-metric'>👁️ {blog.views || 0}</span>
                        </td>
                        <td>
                          <span className='myblogs-metric'>❤️ {blog.likes || 0}</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13.5px', whiteSpace: 'nowrap' }}>
                          {formatDate(blog.createdAt)}
                        </td>
                        <td>
                          <div className='myblogs-actions'>
                            <button
                              onClick={() => navigate(`/blog/${blog._id}`)}
                              className='btn btn-secondary myblogs-action-btn'
                              title='Xem chi tiết bài viết'
                            >
                              Xem
                            </button>
                            <button
                              onClick={() => navigate(`/blog/${blog._id}/edit`)}
                              className='btn btn-secondary myblogs-action-btn'
                              title='Chỉnh sửa bài viết'
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(blog)}
                              className='btn btn-danger myblogs-action-btn'
                              title='Xóa bài viết'
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalBlog && (
        <div className='modal-overlay'>
          <div className='modal-card'>
            <h3 className='modal-title'>Xác nhận xóa bài viết</h3>
            <p className='modal-text'>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{deleteModalBlog.title}"</strong> không? Hành động này không thể hoàn tác.
            </p>
            <div className='modal-actions'>
              <button onClick={handleDeleteConfirm} className='btn btn-danger' disabled={deleting}>
                {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
              <button onClick={() => setDeleteModalBlog(null)} className='btn btn-secondary' disabled={deleting}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBlogs
