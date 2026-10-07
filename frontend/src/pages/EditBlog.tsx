import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogById, updateBlog } from '../services/blogService'
import { useAuth } from '../context/AuthContext'
import MarkdownEditor from '../components/MarkdownEditor'

const CATEGORIES = [
  { name: 'Công nghệ', icon: '💻' },
  { name: 'Lập trình', icon: '⚙️' },
  { name: 'AI', icon: '🤖' },
  { name: 'Cuộc sống', icon: '🌱' }
]

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Công nghệ')
  const [thumbnail, setThumbnail] = useState('')
  const [previewError, setPreviewError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return

      try {
        setLoading(true)
        const blogData = await getBlogById(id)

        if (!blogData) {
          setError('Không tìm thấy bài viết này.')
          setLoading(false)
          return
        }

        if (!currentUser) {
          setError('Bạn cần đăng nhập để chỉnh sửa bài viết.')
          setLoading(false)
          return
        }

        const isAuthor = blogData.author && blogData.author._id === currentUser.id
        const isAdmin = currentUser.role === 'admin'

        if (!isAuthor && !isAdmin) {
          setError('Bạn không có quyền chỉnh sửa bài viết của người khác.')
          setLoading(false)
          return
        }

        setTitle(blogData.title)
        setContent(blogData.content)
        setCategory(blogData.category || 'Công nghệ')
        setThumbnail(blogData.thumbnail || '')
      } catch (err) {
        console.error(err)
        setError('Lỗi tải bài viết để chỉnh sửa.')
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchBlog()
    }
  }, [id, currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('Tiêu đề và Nội dung bài viết không được để trống.')
      return
    }

    if (thumbnail.trim() && !/^https?:\/\/.+/i.test(thumbnail.trim())) {
      setError('Thumbnail URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)')
      return
    }

    if (!id) return

    try {
      setSubmitting(true)
      await updateBlog(id, title.trim(), content.trim(), category, thumbnail.trim())
      setSubmitting(false)
      navigate(`/blog/${id}`)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi trong quá trình cập nhật bài viết.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='form-page'>
        <div className='loading-state' style={{ minHeight: '50vh' }}>
          <div className='spinner' />
          <p>Đang tải nội dung bài viết để chỉnh sửa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='form-page'>
      <div className='form-top-bar'>
        <button onClick={() => navigate(`/blog/${id}`)} className='btn btn-ghost'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
            <line x1='19' y1='12' x2='5' y2='12' />
            <polyline points='12 19 5 12 12 5' />
          </svg>
          <span>Quay lại bài viết</span>
        </button>
      </div>

      <div className='editor-studio-card'>
        <div className='studio-header'>
          <div>
            <span className='section-tag'>Chế độ chỉnh sửa</span>
            <h1 className='studio-title'>Cập nhật bài viết</h1>
            <p className='studio-subtitle'>
              Chỉnh sửa thông tin, làm mới hình ảnh hoặc bổ sung kiến thức cho bài viết của bạn.
            </p>
          </div>
        </div>

        {error && (
          <div className='alert-danger'>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='studio-form'>
          {/* Title */}
          <div className='form-group'>
            <label htmlFor='title' className='form-label'>
              Tiêu đề bài viết <span className='required-star'>*</span>
            </label>
            <input
              id='title'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Nhập tiêu đề bài viết...'
              disabled={submitting}
              className='input input-lg'
            />
          </div>

          {/* Category Selector */}
          <div className='form-group'>
            <label className='form-label'>
              Chuyên mục bài viết <span className='required-star'>*</span>
            </label>
            <div className='category-selector-group'>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.name
                return (
                  <button
                    key={cat.name}
                    type='button'
                    onClick={() => setCategory(cat.name)}
                    className={`category-pill-btn ${isSelected ? 'selected' : ''}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Thumbnail URL Input */}
          <div className='form-group'>
            <div className='form-label-row'>
              <label htmlFor='thumbnail' className='form-label'>
                Ảnh bìa (Thumbnail URL - Tùy chọn)
              </label>
              {thumbnail && (
                <button
                  type='button'
                  onClick={() => {
                    setThumbnail('')
                    setPreviewError(false)
                  }}
                  className='btn-text-action'
                >
                  ✕ Xóa ảnh
                </button>
              )}
            </div>
            <input
              id='thumbnail'
              type='url'
              value={thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value)
                setPreviewError(false)
              }}
              placeholder='Nhập đường dẫn ảnh trực tiếp (ví dụ: https://images.unsplash.com/...)'
              disabled={submitting}
              className='input'
            />

            {/* Thumbnail Live Preview */}
            {thumbnail.trim() && (
              <div className='thumbnail-preview-box'>
                <span className='thumbnail-preview-title'>Xem trước ảnh bìa:</span>
                {previewError ? (
                  <div className='thumbnail-preview-failed'>
                    <span>⚠️ Không thể tải ảnh từ URL này. Vui lòng kiểm tra lại liên kết.</span>
                  </div>
                ) : (
                  <img
                    src={thumbnail.trim()}
                    alt='Preview'
                    className='thumbnail-preview-image'
                    onError={() => setPreviewError(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Markdown Editor */}
          <div className='form-group'>
            <label className='form-label'>
              Nội dung bài viết (Markdown) <span className='required-star'>*</span>
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder='Nhập nội dung bài viết...'
              disabled={submitting}
              rows={16}
            />
          </div>

          {/* Footer Actions */}
          <div className='studio-footer-actions'>
            <button
              type='button'
              onClick={() => navigate(`/blog/${id}`)}
              className='btn btn-secondary'
              disabled={submitting}
            >
              Hủy bỏ
            </button>
            <button
              type='submit'
              disabled={submitting || !title.trim() || !content.trim()}
              className='btn btn-primary btn-lg'
            >
              {submitting ? (
                <>
                  <span className='spinner-inline' />
                  <span>Đang lưu thay đổi...</span>
                </>
              ) : (
                <>
                  <span>Lưu thay đổi bài viết</span>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
                    <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBlog
