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
    <div className='myblogs-page'>
      {/* Header */}
      <div className='myblogs-header-card'>
        <div>
          <span className='section-tag'>Quản trị cá nhân</span>
          <h1 className='myblogs-title'>Bài viết của tôi</h1>
          <p className='myblogs-subtitle'>
            Theo dõi hiệu quả tương tác, số lượt xem và quản lý tất cả bài viết bạn đã xuất bản.
          </p>
        </div>
        <button onClick={() => navigate('/create')} className='btn btn-primary'>
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
            <path d='M12 5v14M5 12h14' />
          </svg>
          <span>Viết bài mới</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='myblogs-skeleton-wrapper'>
          <div className='skeleton-grid' style={{ marginBottom: '24px' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className='skeleton-card' style={{ height: '110px' }} />
            ))}
          </div>
          <div className='skeleton-card' style={{ height: '300px' }} />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className='alert-danger'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button onClick={fetchBlogs} className='btn btn-secondary btn-sm'>
            Thử lại
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Stats Grid */}
          <div className='myblogs-stats-grid'>
            <div className='stat-metric-card metric-primary'>
              <div className='stat-metric-icon'>📝</div>
              <div>
                <span className='stat-metric-label'>Tổng số bài viết</span>
                <span className='stat-metric-number'>{(stats?.totalBlogs || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className='stat-metric-card metric-info'>
              <div className='stat-metric-icon'>👁️</div>
              <div>
                <span className='stat-metric-label'>Tổng lượt xem độc giả</span>
                <span className='stat-metric-number'>{(stats?.totalViews || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className='stat-metric-card metric-rose'>
              <div className='stat-metric-icon'>❤️</div>
              <div>
                <span className='stat-metric-label'>Lượt yêu thích nhận được</span>
                <span className='stat-metric-number'>{(stats?.totalLikes || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {blogs.length === 0 ? (
            <div className='empty-state-card'>
              <div className='empty-state-icon'>✍️</div>
              <h3 className='empty-state-title'>Bạn chưa có bài viết nào</h3>
              <p className='empty-state-desc'>
                Hãy bắt đầu chia sẻ câu chuyện, kiến thức lập trình và kinh nghiệm của bạn với cộng đồng Spiderum ngay
                hôm nay!
              </p>
              <button onClick={() => navigate('/create')} className='btn btn-primary'>
                Viết bài đầu tiên ngay
              </button>
            </div>
          ) : (
            /* Table Card */
            <div className='myblogs-table-card'>
              <div className='table-responsive'>
                <table className='modern-table'>
                  <thead>
                    <tr>
                      <th>Bài viết</th>
                      <th>Chuyên mục</th>
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
                          <div className='table-blog-cell'>
                            {blog.thumbnail && blog.thumbnail.trim() ? (
                              <img
                                src={blog.thumbnail.trim()}
                                alt=''
                                className='table-thumb-mini'
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className='table-thumb-placeholder'>📄</div>
                            )}
                            <Link to={`/blog/${blog._id}`} className='table-blog-title'>
                              {blog.title}
                            </Link>
                          </div>
                        </td>
                        <td>
                          <span className='blog-card-category'>{blog.category || 'Chưa phân loại'}</span>
                        </td>
                        <td>
                          <span className='table-metric'>👁️ {(blog.views || 0).toLocaleString()}</span>
                        </td>
                        <td>
                          <span className='table-metric'>❤️ {(blog.likes || 0).toLocaleString()}</span>
                        </td>
                        <td>
                          <span className='table-date'>{formatDate(blog.createdAt)}</span>
                        </td>
                        <td>
                          <div className='table-actions-group'>
                            <button
                              onClick={() => navigate(`/blog/${blog._id}`)}
                              className='btn btn-secondary btn-sm'
                              title='Xem bài viết'
                            >
                              Xem
                            </button>
                            <button
                              onClick={() => navigate(`/blog/${blog._id}/edit`)}
                              className='btn btn-secondary btn-sm'
                              title='Chỉnh sửa bài viết'
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => setDeleteModalBlog(blog)}
                              className='btn btn-danger btn-sm'
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
        <div className='modal-backdrop'>
          <div className='modal-dialog'>
            <div className='modal-icon-danger'>⚠️</div>
            <h3 className='modal-title'>Xác nhận xóa bài viết</h3>
            <p className='modal-description'>
              Bạn có chắc chắn muốn xóa vĩnh viễn bài viết <strong>"{deleteModalBlog.title}"</strong> không? Hành động
              này không thể hoàn tác.
            </p>
            <div className='modal-actions'>
              <button onClick={() => setDeleteModalBlog(null)} className='btn btn-secondary' disabled={deleting}>
                Hủy bỏ
              </button>
              <button onClick={handleDeleteConfirm} className='btn btn-danger' disabled={deleting}>
                {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`floating-toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default MyBlogs
