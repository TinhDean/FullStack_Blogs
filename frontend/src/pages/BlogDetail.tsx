import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogById, deleteBlog } from '../services/blogService'
import type { Blog, Comment, User } from '../services/blogService'
import { getComments, createComment } from '../services/blogService'
import { likeBlog, increaseView } from '../services/blogService'
import NotFound from './NotFound'

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (err) {
        console.error(err)
      }
    }
    return null
  })
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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

        // tăng view
        await increaseView(id)

        // lấy blog
        const blogData = await getBlogById(id)
        if (!blogData || blogData.message || !blogData.title) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setBlog(blogData)

        // lấy comment
        const commentData = await getComments(id)
        setComments(commentData)
      } catch (error) {
        console.error('Lỗi load dữ liệu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // 💬 COMMENT
  const handleComment = async () => {
    if (!commentText.trim() || !id) return

    try {
      console.log('Sending:', {
        blogId: id,
        content: commentText
      })

      await createComment(id, commentText)

      const data = await getComments(id)
      setComments(data)

      setCommentText('')
    } catch (error) {
      console.error('Comment lỗi:', error)
    }
  }

  // ❤️ LIKE
  const handleLike = async () => {
    if (!id) return

    try {
      await likeBlog(id)

      // 🔥 luôn fetch lại cho chắc
      const updated = await getBlogById(id)
      setBlog(updated)
    } catch (error) {
      console.error('Lỗi like:', error)
    }
  }

  // 🗑️ DELETE
  const handleDelete = () => {
    setShowDeleteModal(true)
  }

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

  if (notFound) {
    return <NotFound />
  }

  if (loading || !blog) {
    return (
      <div className='detail-layout'>
        <div className='loading-state'>
          <div className='spinner' />
          <p>Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  const isAuthor = blog.author && currentUser && blog.author._id === currentUser.id
  const isAdmin = currentUser && currentUser.role === 'admin'
  const canEditOrDelete = isAuthor || isAdmin

  return (
    <div className='detail-layout'>
      {/* Header Actions Area */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        {/* back button */}
        <button onClick={() => navigate('/')} className='btn btn-secondary detail-back-btn' style={{ marginBottom: 0 }}>
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
            <line x1='19' y1='12' x2='5' y2='12' />
            <polyline points='12 19 5 12 12 5' />
          </svg>
          Quay lại trang chủ
        </button>

        {/* Edit/Delete Actions */}
        {canEditOrDelete && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate(`/blog/${blog._id}/edit`)}
              className='btn btn-secondary'
              disabled={deleting}
            >
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
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                <path d='M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
              </svg>
              Sửa bài
            </button>
            <button onClick={handleDelete} className='btn btn-danger' disabled={deleting}>
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
                <polyline points='3 6 5 6 21 6' />
                <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                <line x1='10' y1='11' x2='10' y2='17' />
                <line x1='14' y1='11' x2='14' y2='17' />
              </svg>
              {deleting ? 'Đang xóa...' : 'Xóa bài'}
            </button>
          </div>
        )}
      </div>

      <article className='detail-card'>
        {/* title */}
        <h1 className='detail-title'>{blog.title}</h1>

        {/* meta */}
        <div className='detail-meta'>
          <span>
            Tác giả: <strong>{blog.author?.username || 'Admin'}</strong>
          </span>
          <span className='detail-meta-divider'>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
          {blog.category && (
            <>
              <span className='detail-meta-divider'>•</span>
              <span className='blog-card-category'>{blog.category}</span>
            </>
          )}
        </div>

        <hr className='detail-divider' />

        {/* content */}
        <div className='detail-content' style={{ whiteSpace: 'pre-wrap' }}>
          {blog.content}
        </div>

        {/* actions */}
        <div className='detail-actions'>
          <div className='detail-stats'>
            <span className='detail-stat' title='Lượt xem'>
              👁️ {blog.views} lượt xem
            </span>
            <span className='detail-stat' title='Lượt thích'>
              ❤️ {blog.likes} lượt thích
            </span>
            <span className='detail-stat' title='Bình luận'>
              💬 {comments.length} bình luận
            </span>
          </div>

          {/* LIKE BUTTON */}
          <button onClick={handleLike} className='btn btn-danger'>
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='currentColor'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
            </svg>
            Thích bài viết
          </button>
        </div>

        {/* COMMENT SECTION */}
        <div className='comments-section'>
          <h3 className='comments-title'>Bình luận</h3>

          {/* comment box */}
          {currentUser ? (
            <div className='comment-input-wrapper'>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Bạn nghĩ gì về bài viết này? Viết bình luận...'
                className='comment-textarea'
              />

              <button onClick={handleComment} className='btn btn-primary'>
                Gửi bình luận
              </button>
            </div>
          ) : (
            <div
              className='alert-danger'
              style={{
                backgroundColor: 'var(--accent-light)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent)',
                marginBottom: '28px'
              }}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10' />
                <line x1='12' y1='8' x2='12' y2='12' />
                <line x1='12' y1='16' x2='12.01' y2='16' />
              </svg>
              <span>
                Bạn cần{' '}
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    fontWeight: '700',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                  }}
                >
                  Đăng nhập
                </button>{' '}
                để tham gia bình luận.
              </span>
            </div>
          )}

          {/* comment list */}
          <div className='comments-list'>
            {comments.length === 0 ? (
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}
              >
                Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ!
              </p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className='comment-item'>
                  <span className='comment-item-user'>{c.username}</span>
                  <p className='comment-item-content'>{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>

      {showDeleteModal && (
        <div className='modal-overlay'>
          <div className='modal-card'>
            <h3 className='modal-title'>Xác nhận xóa</h3>
            <p className='modal-text'>
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
            </p>
            <div className='modal-actions'>
              <button onClick={handleDeleteConfirm} className='btn btn-danger' disabled={deleting}>
                {deleting ? 'Đang xóa...' : 'Xóa bài viết'}
              </button>
              <button onClick={() => setShowDeleteModal(false)} className='btn btn-secondary' disabled={deleting}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className='toast-icon'>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className='toast-message'>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default BlogDetail
