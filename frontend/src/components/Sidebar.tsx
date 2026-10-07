import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')
  const searchQuery = searchParams.get('search')

  const isAllActive = !activeCategory && !searchQuery

  const categories = [
    { name: 'Công nghệ', icon: '💻', desc: 'Kiến trúc, cloud & hạ tầng' },
    { name: 'Lập trình', icon: '⚙️', desc: 'React, Node.js & TypeScript' },
    { name: 'AI', icon: '🤖', desc: 'Trí tuệ nhân tạo & LLM' },
    { name: 'Cuộc sống', icon: '🌱', desc: 'Góc nhìn & bài học IT' }
  ]

  return (
    <aside className='sidebar-container'>
      <div className='sidebar-card'>
        <div className='sidebar-header'>
          <h3 className='sidebar-title'>Chủ đề khám phá</h3>
          <span className='sidebar-badge'>4 chuyên mục</span>
        </div>

        <ul className='sidebar-menu'>
          <li
            onClick={() => navigate('/')}
            className={`sidebar-item ${isAllActive ? 'active' : ''}`}
            role='button'
            tabIndex={0}
          >
            <div className='sidebar-item-icon'>📝</div>
            <div className='sidebar-item-content'>
              <span className='sidebar-item-name'>Tất cả bài viết</span>
              <span className='sidebar-item-desc'>Tổng hợp mọi chủ đề</span>
            </div>
            {isAllActive && <span className='sidebar-active-indicator' />}
          </li>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.name
            return (
              <li
                key={cat.name}
                onClick={() => navigate(`/?category=${encodeURIComponent(cat.name)}`)}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                role='button'
                tabIndex={0}
              >
                <div className='sidebar-item-icon'>{cat.icon}</div>
                <div className='sidebar-item-content'>
                  <span className='sidebar-item-name'>{cat.name}</span>
                  <span className='sidebar-item-desc'>{cat.desc}</span>
                </div>
                {isActive && <span className='sidebar-active-indicator' />}
              </li>
            )
          })}
        </ul>

        {/* Community write prompt card */}
        <div className='sidebar-prompt-card'>
          <div className='sidebar-prompt-icon'>✍️</div>
          <h4 className='sidebar-prompt-title'>Chia sẻ tri thức</h4>
          <p className='sidebar-prompt-text'>Góc nhìn của bạn có thể truyền cảm hứng cho hàng ngàn lập trình viên.</p>
          <button
            onClick={() => navigate(user ? '/create' : '/login')}
            className='btn btn-primary btn-sm sidebar-prompt-btn'
          >
            Bắt đầu viết bài
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
