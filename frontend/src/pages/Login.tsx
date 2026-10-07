import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface LocationState {
  from?: {
    pathname?: string
  }
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const locationState = location.state as LocationState | null
  const from = locationState?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin đăng nhập.')
      return
    }

    try {
      setLoading(true)
      await login(email.trim(), password.trim())
      setLoading(false)
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.')
      setLoading(false)
    }
  }

  const fillCredentials = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail)
    setPassword(fillPass)
    setError('')
  }

  return (
    <div className='auth-page-wrapper'>
      <div className='auth-card'>
        {/* Brand & Title */}
        <div className='auth-header'>
          <div className='auth-brand-icon'>🕷️</div>
          <h1 className='auth-title'>Chào mừng trở lại</h1>
          <p className='auth-subtitle'>Đăng nhập để tiếp tục đóng góp bài viết và thảo luận trên Spiderum</p>
        </div>

        {error && (
          <div className='alert-danger'>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='form-group'>
            <label htmlFor='email' className='form-label'>
              Email hoặc Username
            </label>
            <input
              id='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Nhập email hoặc username...'
              disabled={loading}
              className='input'
              autoComplete='username'
            />
          </div>

          <div className='form-group'>
            <div className='form-label-row'>
              <label htmlFor='password' className='form-label'>
                Mật khẩu
              </label>
              <button type='button' onClick={() => setShowPassword(!showPassword)} className='btn-text-action'>
                {showPassword ? 'Ẩn' : 'Hiện'} mật khẩu
              </button>
            </div>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Nhập mật khẩu...'
              disabled={loading}
              className='input'
              autoComplete='current-password'
            />
          </div>

          <button type='submit' disabled={loading} className='btn btn-primary btn-lg full-width auth-submit-btn'>
            {loading ? (
              <>
                <span className='spinner-inline' />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill for Portfolio Review */}
        <div className='auth-demo-helper'>
          <div className='demo-helper-header'>
            <span>🚀 Tài khoản demo phỏng vấn:</span>
          </div>
          <div className='demo-helper-buttons'>
            <button
              type='button'
              onClick={() => fillCredentials('admin@spiderum.dev', 'Admin@2026')}
              className='demo-quick-btn'
              title='Nhập tài khoản Quản trị viên'
            >
              👑 Admin: <code>admin@spiderum.dev</code>
            </button>
            <button
              type='button'
              onClick={() => fillCredentials('nam.tech@spiderum.dev', 'User@2026')}
              className='demo-quick-btn'
              title='Nhập tài khoản Tác giả Lập trình'
            >
              ✍️ User: <code>nam.tech@spiderum.dev</code>
            </button>
          </div>
        </div>

        <div className='auth-footer'>
          <span>Chưa có tài khoản?</span>{' '}
          <Link to='/register' className='auth-link'>
            Đăng ký tài khoản ngay
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
