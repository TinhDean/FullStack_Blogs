import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../services/blogService'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [user] = useState<User | null>(() => {
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
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
