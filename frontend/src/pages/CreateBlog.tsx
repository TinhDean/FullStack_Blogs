import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBlog } from '../services/blogService'
import MarkdownEditor from '../components/MarkdownEditor'

const CATEGORIES = [
  { name: 'Công nghệ', icon: '💻' },
  { name: 'Lập trình', icon: '⚙️' },
  { name: 'AI', icon: '🤖' },
  { name: 'Cuộc sống', icon: '🌱' }
]

const CreateBlog = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Công nghệ')
  const [thumbnail, setThumbnail] = useState('')
  const [previewError, setPreviewError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Tiêu đề bài viết không được để trống.')
      return
    }
    if (!content.trim()) {
      setError('Nội dung bài viết không được để trống.')
      return
    }
    if (thumbnail.trim() && !/^https?:\/\/.+/i.test(thumbnail.trim())) {
      setError('Thumbnail URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)')
      return
    }

    try {
      setLoading(true)
      const newBlog = await createBlog(title.trim(), content.trim(), category, thumbnail.trim())
      setLoading(false)
      if (newBlog && newBlog._id) {
        navigate(`/blog/${newBlog._id}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi trong quá trình tạo bài viết.')
      setLoading(false)
    }
  }

  return (
    <div className='form-page'>
      <div className='form-top-bar'>
        <button onClick={() => navigate('/')} className='btn btn-ghost'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
            <line x1='19' y1='12' x2='5' y2='12' />
            <polyline points='12 19 5 12 12 5' />
          </svg>
          <span>Quay lại trang chủ</span>
        </button>
      </div>

      <div className='editor-studio-card'>
        <div className='studio-header'>
          <div>
            <span className='section-tag'>Studio sáng tạo</span>
            <h1 className='studio-title'>Soạn thảo bài viết mới</h1>
            <p className='studio-subtitle'>
              Chia sẻ kiến thức lập trình, câu chuyện công nghệ và góc nhìn của bạn đến cộng đồng.
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
          {/* Title Input */}
          <div className='form-group'>
            <label htmlFor='title' className='form-label'>
              Tiêu đề bài viết <span className='required-star'>*</span>
            </label>
            <input
              id='title'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Ví dụ: Tối ưu hóa hiệu năng React 19 với Server Components...'
              disabled={loading}
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
              disabled={loading}
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

          {/* Markdown Content Editor */}
          <div className='form-group'>
            <label className='form-label'>
              Nội dung bài viết (Markdown) <span className='required-star'>*</span>
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder='Bắt đầu soạn thảo nội dung với cú pháp Markdown... Hỗ trợ code blocks, trích dẫn, ảnh, liên kết...'
              disabled={loading}
              rows={16}
            />
          </div>

          {/* Actions */}
          <div className='studio-footer-actions'>
            <button type='button' onClick={() => navigate('/')} className='btn btn-secondary' disabled={loading}>
              Hủy bỏ
            </button>
            <button
              type='submit'
              disabled={loading || !title.trim() || !content.trim()}
              className='btn btn-primary btn-lg'
            >
              {loading ? (
                <>
                  <span className='spinner-inline' />
                  <span>Đang xuất bản bài viết...</span>
                </>
              ) : (
                <>
                  <span>Xuất bản bài viết</span>
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

export default CreateBlog
