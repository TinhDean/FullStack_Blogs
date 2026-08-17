import { useNavigate, useSearchParams } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')
  const searchQuery = searchParams.get('search')

  // "Tất cả bài viết" is active when there is no category filtering AND we are not searching
  const isAllActive = !activeCategory && !searchQuery

  const categories = [
    { name: 'Công nghệ', icon: '💻' },
    { name: 'Lập trình', icon: '⚙️' },
    { name: 'Cuộc sống', icon: '🌱' },
    { name: 'AI', icon: '🤖' }
  ]

  return (
    <aside className='sidebar-container'>
      <h3 className='sidebar-title'>Danh mục</h3>

      <ul className='sidebar-menu'>
        <li onClick={() => navigate('/')} className={`sidebar-item ${isAllActive ? 'active' : ''}`}>
          <span>📝</span> Tất cả bài viết
        </li>

        {categories.map((cat) => (
          <li
            key={cat.name}
            onClick={() => navigate(`/?category=${encodeURIComponent(cat.name)}`)}
            className={`sidebar-item ${activeCategory === cat.name ? 'active' : ''}`}
          >
            <span>{cat.icon}</span> {cat.name}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
