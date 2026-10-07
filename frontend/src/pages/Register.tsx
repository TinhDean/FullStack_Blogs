import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/blogService'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { setAuthData } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validations
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả thông tin.')
      return
    }

    if (username.trim().length < 3) {
      setError('Tên người dùng phải có tối thiểu 3 ký tự.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Định dạng Email không hợp lệ.')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có độ dài tối thiểu 6 ký tự.')
      return
    }

    if (password !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp.')
      return
    }

    try {
      setLoading(true)
      const data = await registerUser(username.trim(), email.trim(), password)
      setAuthData(data.token, data.user)
      setLoading(false)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  return (
    <div className='auth-page-wrapper'>
      <div className='auth-card'>
        <div className='auth-header'>
          <div className='auth-brand-icon'>🕷️</div>
          <h1 className='auth-title'>Tham gia cộng đồng</h1>
          <p className='auth-subtitle'>
            Tạo tài khoản để bắt đầu viết bài, tham gia thảo luận và kết nối cùng cộng đồng Spiderum
          </p>
        </div>

        {error && (
          <div className='alert-danger'>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='form-group'>
            <label htmlFor='username' className='form-label'>
              Tên người dùng (Username)
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Ví dụ: nguyenvana'
              disabled={loading}
              className='input'
              autoComplete='username'
            />
            <span className='form-hint'>Tối thiểu 3 ký tự, không dấu cách</span>
          </div>

          <div className='form-group'>
            <label htmlFor='email' className='form-label'>
              Địa chỉ Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='name@example.com'
              disabled={loading}
              className='input'
              autoComplete='email'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password' className='form-label'>
              Mật khẩu
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Tối thiểu 6 ký tự...'
              disabled={loading}
              className='input'
              autoComplete='new-password'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword' className='form-label'>
              Xác nhận mật khẩu
            </label>
            <input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Nhập lại mật khẩu vừa nhập...'
              disabled={loading}
              className='input'
              autoComplete='new-password'
            />
          </div>

          <button type='submit' disabled={loading} className='btn btn-primary btn-lg full-width auth-submit-btn'>
            {loading ? (
              <>
                <span className='spinner-inline' />
                <span>Đang khởi tạo tài khoản...</span>
              </>
            ) : (
              <span>Đăng ký ngay</span>
            )}
          </button>
        </form>

        <div className='auth-footer'>
          <span>Đã có tài khoản?</span>{' '}
          <Link to='/login' className='auth-link'>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
