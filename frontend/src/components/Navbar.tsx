import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/')
    }
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const handleWriteClick = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/create')
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className='navbar-wrapper'>
      <div className='navbar-container'>
        {/* Brand */}
        <div className='navbar-brand-group' onClick={() => navigate('/')}>
          <div className='navbar-logo-icon'>
            <span>🕷️</span>
          </div>
          <div className='navbar-brand-text'>
            <span className='navbar-brand-name'>Spiderum</span>
            <span className='navbar-brand-badge'>Tech & Life</span>
          </div>
        </div>

        {/* Search */}
        <div className='navbar-search-wrapper'>
          <span className='navbar-search-icon'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='11' cy='11' r='8' />
              <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
          </span>
          <input
            className='navbar-search-input'
            placeholder='Tìm kiếm bài viết, tác giả, công nghệ...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => {
                setSearchQuery('')
                navigate('/')
              }}
              className='navbar-search-clear'
              title='Xóa tìm kiếm'
            >
              ✕
            </button>
          )}
        </div>

        {/* Desktop Actions */}
        <div className='navbar-actions desktop-only'>
          <button
            onClick={handleWriteClick}
            className={`btn ${location.pathname === '/create' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <svg
              width='15'
              height='15'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 5v14M5 12h14' />
            </svg>
            <span>Viết bài</span>
          </button>

          {user ? (
            <div className='navbar-user-section'>
              <button
                onClick={() => navigate('/my-blogs')}
                className={`btn ${location.pathname === '/my-blogs' ? 'btn-primary' : 'btn-secondary'}`}
                title='Quản lý bài viết của tôi'
              >
                <svg
                  width='15'
                  height='15'
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
                </svg>
                <span>Bài viết của tôi</span>
              </button>

              <div className='navbar-user-chip'>
                <div className='navbar-user-avatar'>{user.username.slice(0, 2).toUpperCase()}</div>
                <div className='navbar-user-details'>
                  <span className='navbar-user-name'>{user.username}</span>
                  <span className={`navbar-role-tag role-${user.role}`}>{user.role}</span>
                </div>
              </div>

              <button onClick={handleLogout} className='btn btn-ghost-danger' title='Đăng xuất'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                  <polyline points='16 17 21 12 16 7' />
                  <line x1='21' y1='12' x2='9' y2='12' />
                </svg>
                <span>Thoát</span>
              </button>
            </div>
          ) : (
            <div className='navbar-auth-buttons'>
              <button onClick={() => navigate('/login')} className='btn btn-ghost'>
                Đăng nhập
              </button>
              <button onClick={() => navigate('/register')} className='btn btn-primary'>
                Đăng ký
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className='mobile-menu-toggle mobile-only'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? (
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          ) : (
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className='mobile-drawer'>
          <button onClick={handleWriteClick} className='btn btn-primary full-width'>
            ✍️ Viết bài mới
          </button>
          {user ? (
            <>
              <div className='mobile-user-card'>
                <div className='navbar-user-avatar'>{user.username.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className='navbar-user-name'>{user.username}</div>
                  <span className={`navbar-role-tag role-${user.role}`}>{user.role}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate('/my-blogs')
                  setMobileMenuOpen(false)
                }}
                className='btn btn-secondary full-width'
              >
                📁 Bài viết của tôi
              </button>
              <button onClick={handleLogout} className='btn btn-danger full-width'>
                🚪 Đăng xuất
              </button>
            </>
          ) : (
            <div className='mobile-auth-stack'>
              <button
                onClick={() => {
                  navigate('/login')
                  setMobileMenuOpen(false)
                }}
                className='btn btn-secondary full-width'
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  navigate('/register')
                  setMobileMenuOpen(false)
                }}
                className='btn btn-primary full-width'
              >
                Đăng ký tài khoản
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
