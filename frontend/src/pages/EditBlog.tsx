import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogById, updateBlog } from '../services/blogService'
import { useAuth } from '../context/AuthContext'
import MarkdownEditor from '../components/MarkdownEditor'

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

        // Kiểm tra quyền sửa (phải là người viết hoặc admin)
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
      <div className='form-layout'>
        <div className='loading-state'>
          <div className='spinner' />
          <p>Đang tải nội dung bài viết...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='form-layout'>
      <button onClick={() => navigate(`/blog/${id}`)} className='btn btn-secondary detail-back-btn'>
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
        Hủy chỉnh sửa
      </button>

      <div className='form-card'>
        <h1 className='form-title'>Chỉnh sửa bài viết</h1>

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

        {/* Chỉ hiển thị form nếu không có lỗi phân quyền hoặc lỗi bài viết */}
        {!error && (
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
                placeholder='Nhập tiêu đề...'
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
                minHeight='360px'
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                type='submit'
                disabled={submitting}
                className='btn btn-primary'
                style={{ padding: '10px 24px', fontSize: '15px' }}
              >
                {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button
                type='button'
                onClick={() => navigate(`/blog/${id}`)}
                className='btn btn-secondary'
                style={{ padding: '10px 24px', fontSize: '15px' }}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditBlog
