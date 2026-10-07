import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogById, deleteBlog, deleteComment } from '../services/blogService'
import type { Blog, Comment } from '../services/blogService'
import { getComments, createComment } from '../services/blogService'
import { likeBlog, increaseView } from '../services/blogService'
import { useAuth } from '../context/AuthContext'
import MarkdownRenderer from '../components/MarkdownRenderer'
import NotFound from './NotFound'

const estimateReadingTime = (text?: string): number => {
  if (!text) return 1
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

const getInitials = (name?: string): string => {
  if (!name) return 'U'
  return name.slice(0, 2).toUpperCase()
}

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteModalComment, setDeleteModalComment] = useState<Comment | null>(null)
  const [deletingComment, setDeletingComment] = useState(false)
  const [liked, setLiked] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return

        // Tăng lượt xem
        await increaseView(id)

        // Lấy chi tiết bài viết
        const blogData = await getBlogById(id)
        if (!blogData || !blogData.title) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setBlog(blogData)

        // Lấy danh sách bình luận
        const commentData = await getComments(id)
        setComments(commentData)
      } catch (error) {
        console.error('Lỗi load dữ liệu:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Bình luận
  const handleComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!commentText.trim() || !id || submittingComment) return

    try {
      setSubmittingComment(true)
      await createComment(id, commentText.trim())
      const data = await getComments(id)
      setComments(data)
      setCommentText('')
      triggerToast('Bình luận đã được đăng thành công!', 'success')
    } catch (error) {
      console.error('Lỗi gửi comment:', error)
      triggerToast(error instanceof Error ? error.message : 'Gửi bình luận thất bại', 'error')
    } finally {
      setSubmittingComment(false)
    }
  }

  // Thích bài viết
  const handleLike = async () => {
    if (!id || !blog) return

    try {
      setLiked(true)
      const updated = await likeBlog(id)
      setBlog(updated)
      triggerToast('Đã thích bài viết!', 'success')
    } catch (error) {
      console.error('Lỗi like bài:', error)
      triggerToast('Không thể thích bài viết', 'error')
    }
  }

  // Xóa bài viết
  const handleDeleteConfirm = async () => {
    if (!id) return

    try {
      setDeleting(true)
      await deleteBlog(id)
      setDeleting(false)
      setShowDeleteModal(false)
      triggerToast('Xóa bài viết thành công!', 'success')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      console.error('Lỗi xóa bài:', error)
      triggerToast(error instanceof Error ? error.message : 'Xóa bài viết thất bại.', 'error')
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // Xóa bình luận
  const handleDeleteCommentConfirm = async () => {
    if (!deleteModalComment) return

    try {
      setDeletingComment(true)
      await deleteComment(deleteModalComment._id)
      setComments((prev) => prev.filter((c) => c._id !== deleteModalComment._id))
      setDeleteModalComment(null)
      triggerToast('Đã xóa bình luận!', 'success')
    } catch (error) {
      console.error('Lỗi xóa bình luận:', error)
      triggerToast(error instanceof Error ? error.message : 'Xóa bình luận thất bại.', 'error')
    } finally {
      setDeletingComment(false)
    }
  }

  if (notFound) {
    return <NotFound />
  }

  if (loading || !blog) {
    return (
      <div className='detail-layout'>
        <div className='detail-skeleton'>
          <div className='skeleton-line short' />
          <div className='skeleton-line full' style={{ height: '40px', margin: '20px 0' }} />
          <div className='skeleton-line medium' />
          <div className='skeleton-thumb' style={{ height: '340px', margin: '28px 0', borderRadius: '16px' }} />
          <div className='skeleton-line full' />
          <div className='skeleton-line full' />
          <div className='skeleton-line medium' />
        </div>
      </div>
    )
  }

  const isAuthor = blog.author && currentUser && blog.author._id === currentUser.id
  const isAdmin = currentUser && currentUser.role === 'admin'
  const canEditOrDelete = isAuthor || isAdmin
  const authorName = blog.author?.username || 'Tác giả Spiderum'
  const readingTime = estimateReadingTime(blog.content)

  return (
    <div className='detail-page'>
      {/* Top Breadcrumb & Action bar */}
      <div className='detail-top-bar'>
        <button onClick={() => navigate('/')} className='btn btn-ghost detail-back-btn'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
            <line x1='19' y1='12' x2='5' y2='12' />
            <polyline points='12 19 5 12 12 5' />
          </svg>
          <span>Quay lại trang chủ</span>
        </button>

        {canEditOrDelete && (
          <div className='detail-author-actions'>
            <button
              onClick={() => navigate(`/blog/${blog._id}/edit`)}
              className='btn btn-secondary'
              disabled={deleting}
            >
              <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                <path d='M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
              </svg>
              <span>Chỉnh sửa</span>
            </button>
            <button onClick={() => setShowDeleteModal(true)} className='btn btn-danger' disabled={deleting}>
              <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <polyline points='3 6 5 6 21 6' />
                <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
              </svg>
              <span>{deleting ? 'Đang xóa...' : 'Xóa bài'}</span>
            </button>
          </div>
        )}
      </div>

      <article className='detail-article'>
        {/* Category Badge */}
        {blog.category && (
          <div className='detail-category-wrapper'>
            <span className='blog-card-category'>{blog.category}</span>
          </div>
        )}

        {/* Title */}
        <h1 className='detail-main-title'>{blog.title}</h1>

        {/* Author & Meta bar */}
        <div className='detail-author-card'>
          <div className='detail-author-avatar'>{getInitials(authorName)}</div>
          <div className='detail-author-meta'>
            <div className='detail-author-row'>
              <span className='detail-author-name'>{authorName}</span>
              {isAuthor && <span className='author-badge-self'>Tác giả của bạn</span>}
              {isAdmin && !isAuthor && <span className='author-badge-admin'>Admin</span>}
            </div>
            <div className='detail-meta-sub'>
              <span>
                {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className='meta-dot'>•</span>
              <span>{readingTime} phút đọc</span>
              <span className='meta-dot'>•</span>
              <span>{blog.views.toLocaleString()} lượt xem</span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {blog.thumbnail && blog.thumbnail.trim() && (
          <div className='detail-cover-wrapper'>
            <img
              src={blog.thumbnail.trim()}
              alt={blog.title}
              className='detail-cover-img'
              onError={(e) => {
                const parent = e.currentTarget.parentElement
                if (parent) parent.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Article Markdown Content */}
        <div className='detail-markdown-body'>
          <MarkdownRenderer content={blog.content} />
        </div>

        {/* Interaction Bar */}
        <div className='detail-interaction-card'>
          <div className='detail-stats-group'>
            <div className='stat-pill'>
              <span>👁️</span>
              <span>{blog.views.toLocaleString()} lượt xem</span>
            </div>
            <div className='stat-pill'>
              <span>💬</span>
              <span>{comments.length} bình luận</span>
            </div>
          </div>

          <div className='detail-like-wrapper'>
            <button
              onClick={handleLike}
              className={`btn ${liked ? 'btn-danger' : 'btn-outline-danger'} detail-like-btn`}
              title='Thích bài viết'
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill={liked ? 'currentColor' : 'none'}
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
              </svg>
              <span>Thích ({blog.likes.toLocaleString()})</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className='comments-section'>
          <div className='comments-header'>
            <h3 className='comments-title'>
              Bình luận <span className='comments-counter'>({comments.length})</span>
            </h3>
            <span className='comments-subtitle'>Chia sẻ góc nhìn và thảo luận văn minh cùng cộng đồng</span>
          </div>

          {/* Comment Form */}
          {currentUser ? (
            <form onSubmit={handleComment} className='comment-form-card'>
              <div className='comment-form-header'>
                <div className='navbar-user-avatar small'>{getInitials(currentUser.username)}</div>
                <span className='comment-form-user'>
                  Bình luận dưới tên <strong>{currentUser.username}</strong>
                </span>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Bạn có góc nhìn hay phản biện gì về bài viết này? Viết bình luận của bạn...'
                className='comment-textarea'
                rows={3}
                disabled={submittingComment}
              />
              <div className='comment-form-actions'>
                <button type='submit' disabled={!commentText.trim() || submittingComment} className='btn btn-primary'>
                  {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </div>
            </form>
          ) : (
            <div className='comment-login-banner'>
              <div className='login-banner-icon'>💬</div>
              <div className='login-banner-content'>
                <h4>Tham gia cuộc thảo luận</h4>
                <p>Bạn cần đăng nhập tài khoản để viết bình luận và tương tác với tác giả.</p>
              </div>
              <button onClick={() => navigate('/login')} className='btn btn-primary'>
                Đăng nhập ngay
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className='comments-list'>
            {comments.length === 0 ? (
              <div className='empty-comments'>
                <span className='empty-comments-icon'>💭</span>
                <p>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ về bài viết này!</p>
              </div>
            ) : (
              comments.map((c) => {
                const canDelete = currentUser && (c.userId === currentUser.id || currentUser.role === 'admin')

                return (
                  <div key={c._id} className='comment-card'>
                    <div className='comment-card-header'>
                      <div className='comment-author-group'>
                        <div className='comment-avatar'>{getInitials(c.username)}</div>
                        <div>
                          <span className='comment-author-name'>{c.username}</span>
                          <span className='comment-date'>
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong'}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => setDeleteModalComment(c)}
                          className='btn-delete-comment'
                          title='Xóa bình luận'
                        >
                          ✕ Xóa
                        </button>
                      )}
                    </div>
                    <p className='comment-card-body'>{c.content}</p>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </article>

      {/* Delete Blog Modal */}
      {showDeleteModal && (
        <div className='modal-backdrop'>
          <div className='modal-dialog'>
            <div className='modal-icon-danger'>⚠️</div>
            <h3 className='modal-title'>Xác nhận xóa bài viết</h3>
            <p className='modal-description'>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{blog.title}"</strong> không? Toàn bộ bình luận và dữ liệu
              liên quan sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </p>
            <div className='modal-actions'>
              <button onClick={() => setShowDeleteModal(false)} className='btn btn-secondary' disabled={deleting}>
                Hủy bỏ
              </button>
              <button onClick={handleDeleteConfirm} className='btn btn-danger' disabled={deleting}>
                {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Comment Modal */}
      {deleteModalComment && (
        <div className='modal-backdrop'>
          <div className='modal-dialog'>
            <div className='modal-icon-danger'>💬</div>
            <h3 className='modal-title'>Xác nhận xóa bình luận</h3>
            <p className='modal-description'>
              Bạn có chắc chắn muốn xóa bình luận này không? Bình luận đã xóa sẽ không thể phục hồi.
            </p>
            <div className='modal-actions'>
              <button
                onClick={() => setDeleteModalComment(null)}
                className='btn btn-secondary'
                disabled={deletingComment}
              >
                Hủy bỏ
              </button>
              <button onClick={handleDeleteCommentConfirm} className='btn btn-danger' disabled={deletingComment}>
                {deletingComment ? 'Đang xóa...' : 'Xóa bình luận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`floating-toast toast-${toast.type}`}>
          <span className='toast-symbol'>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default BlogDetail
