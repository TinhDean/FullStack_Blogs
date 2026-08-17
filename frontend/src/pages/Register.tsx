import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/blogService'

const Register = () => {
  const navigate = useNavigate()
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

    // Email format validation
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

      // Đăng nhập tự động sau khi đăng ký
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setLoading(false)
      window.location.href = '/'
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.')
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

      <div className='form-card' style={{ maxWidth: '480px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '32px' }}>🕷️</span>
          <h1 className='form-title' style={{ marginTop: '12px', marginBottom: '4px' }}>
            Tham gia Spiderum
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px' }}>Tạo tài khoản để chia sẻ quan điểm của bạn</p>
        </div>

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
            <label htmlFor='username' className='form-label'>
              Tên người dùng
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Nhập tên người dùng...'
              disabled={loading}
              className='input'
            />
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
              placeholder='Nhập địa chỉ email...'
              disabled={loading}
              className='input'
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
              placeholder='Nhập lại mật khẩu...'
              disabled={loading}
              className='input'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn btn-primary'
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: 'var(--text-muted)'
          }}
        >
          Đã có tài khoản?{' '}
          <Link to='/login' style={{ color: 'var(--accent)', fontWeight: '600' }}>
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
