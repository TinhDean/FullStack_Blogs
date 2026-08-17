import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className='footer-wrapper'>
      <div className='footer-container'>
        <div className='footer-brand-section'>
          <h2 className='footer-brand' onClick={() => navigate('/')}>
            Spiderum
          </h2>
          <p className='footer-description'>
            Nơi chia sẻ kiến thức, quan điểm và trải nghiệm thực tế của cộng đồng viết lách Việt Nam.
          </p>
        </div>

        <div className='footer-links-section'>
          <div className='footer-link-group'>
            <h4 className='footer-link-title'>Chủ đề</h4>
            <ul className='footer-links'>
              <li onClick={() => navigate('/?category=Công nghệ')}>💻 Công nghệ</li>
              <li onClick={() => navigate('/?category=Lập trình')}>⚙️ Lập trình</li>
              <li onClick={() => navigate('/?category=Cuộc sống')}>🌱 Cuộc sống</li>
              <li onClick={() => navigate('/?category=AI')}>🤖 AI</li>
            </ul>
          </div>

          <div className='footer-link-group'>
            <h4 className='footer-link-title'>Liên kết</h4>
            <ul className='footer-links'>
              <li onClick={() => navigate('/')}>Trang chủ</li>
              <li onClick={() => navigate('/create')}>Viết bài</li>
              <li onClick={() => navigate('/login')}>Đăng nhập</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <p className='footer-copyright'>
          © {new Date().getFullYear()} Spiderum. Thiết kế và phát triển bởi Antigravity.
        </p>
      </div>
    </footer>
  )
}

export default Footer
