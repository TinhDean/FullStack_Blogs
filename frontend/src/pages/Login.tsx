import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = (location.state as any)?.from?.pathname || '/'

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
            Chào mừng trở lại
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px' }}>Đăng nhập để tiếp tục đóng góp cho Spiderum</p>
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
              placeholder='Nhập mật khẩu...'
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
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
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
          Chưa có tài khoản?{' '}
          <Link to='/register' style={{ color: 'var(--accent)', fontWeight: '600' }}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
