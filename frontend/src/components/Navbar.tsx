import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleWriteClick = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/create')
    }
  }

  return (
    <header className='navbar-wrapper'>
      <div className='navbar-container'>
        <h2 className='navbar-brand' onClick={() => navigate('/')}>
          Spiderum
        </h2>

        <div className='navbar-search-wrapper'>
          <span className='navbar-search-icon'>
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
              <circle cx='11' cy='11' r='8' />
              <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
          </span>
          <input
            className='navbar-search-input'
            placeholder='Tìm kiếm bài viết...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
        </div>

        <div className='navbar-actions'>
          <button onClick={handleWriteClick} className='btn btn-secondary'>
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
              <path d='M12 5v14M5 12h14' />
            </svg>
            Viết bài
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => navigate('/my-blogs')} className='btn btn-secondary'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                  <polyline points='14 2 14 8 20 8' />
                  <line x1='16' y1='13' x2='8' y2='13' />
                  <line x1='16' y1='17' x2='8' y2='17' />
                  <polyline points='10 9 9 9 8 9' />
                </svg>
                Bài viết của tôi
              </button>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-title)',
                  backgroundColor: 'var(--border-color)',
                  padding: '6px 12px',
                  borderRadius: '9999px'
                }}
              >
                👤 {user.username}
              </span>
              <button onClick={handleLogout} className='btn btn-danger'>
                Đăng xuất
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='btn btn-primary'>
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
