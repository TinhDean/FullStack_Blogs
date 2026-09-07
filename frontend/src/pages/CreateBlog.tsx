import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBlog } from '../services/blogService'
import MarkdownEditor from '../components/MarkdownEditor'

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

    // Validation cơ bản
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
      // Điều hướng về trang chi tiết bài viết mới tạo
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
    <div className='form-layout'>
      <button onClick={() => navigate('/')} className='btn btn-secondary detail-back-btn'>
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

      <div className='form-card'>
        <h1 className='form-title'>Viết bài mới</h1>

        {error && (
          <div className='alert-danger'>
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
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='title' className='form-label'>
              Tiêu đề bài viết
            </label>
            <input
              id='title'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Nhập tiêu đề ấn tượng cho bài viết...'
              disabled={loading}
              className='input'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='category' className='form-label'>
              Danh mục bài viết
            </label>
            <select
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className='form-select'
            >
              <option value='Công nghệ'>💻 Công nghệ</option>
              <option value='Lập trình'>⚙️ Lập trình</option>
              <option value='Cuộc sống'>🌱 Cuộc sống</option>
              <option value='AI'>🤖 AI</option>
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='thumbnail' className='form-label' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Ảnh bìa (Thumbnail URL - Tùy chọn)</span>
              {thumbnail && (
                <button
                  type='button'
                  onClick={() => {
                    setThumbnail('')
                    setPreviewError(false)
                  }}
                  className='btn-text-action'
                  title='Xóa ảnh bìa'
                >
                  ✕ Xóa URL ảnh
                </button>
              )}
            </label>
            <input
              id='thumbnail'
              type='url'
              value={thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value)
                setPreviewError(false)
              }}
              placeholder='Nhập đường dẫn ảnh trực tiếp (ví dụ: https://images.unsplash.com/...)...'
              disabled={loading}
              className='input'
            />
            {thumbnail.trim() && (
              <div className='thumbnail-preview-container'>
                <div className='thumbnail-preview-label'>Xem trước ảnh bìa:</div>
                {previewError ? (
                  <div className='thumbnail-preview-error'>
                    ⚠️ Không thể tải ảnh từ URL này. Vui lòng kiểm tra lại đường dẫn hợp lệ.
                  </div>
                ) : (
                  <img
                    src={thumbnail.trim()}
                    alt='Xem trước ảnh bìa'
                    className='thumbnail-preview-img'
                    onError={() => setPreviewError(true)}
                  />
                )}
              </div>
            )}
          </div>

          <div className='form-group'>
            <label htmlFor='content' className='form-label'>
              Nội dung bài viết (Markdown)
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder='Nhập nội dung bài viết hỗ trợ Markdown (tiêu đề #, in đậm **, code block ```, danh sách, link...)...'
              disabled={loading}
              minHeight='360px'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn btn-primary'
            style={{ padding: '10px 24px', fontSize: '15px' }}
          >
            {loading ? 'Đang gửi...' : 'Xuất bản bài viết'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateBlog
