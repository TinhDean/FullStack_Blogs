import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className='footer-wrapper'>
      <div className='footer-container'>
        <div className='footer-brand-section'>
          <div className='footer-brand-row' onClick={() => navigate('/')}>
            <span className='footer-brand-icon'>🕷️</span>
            <span className='footer-brand-title'>Spiderum</span>
          </div>
          <p className='footer-description'>
            Nền tảng chia sẻ góc nhìn công nghệ, kiến thức lập trình Full-Stack, AI và trải nghiệm nghề nghiệp thực tế
            của các kỹ sư phần mềm.
          </p>
          <div className='footer-tech-badges'>
            <span className='footer-badge'>React 19</span>
            <span className='footer-badge'>TypeScript</span>
            <span className='footer-badge'>Express 5</span>
            <span className='footer-badge'>MongoDB</span>
            <span className='footer-badge'>Vitest</span>
          </div>
        </div>

        <div className='footer-links-section'>
          <div className='footer-link-group'>
            <h4 className='footer-link-title'>Chủ đề tiêu biểu</h4>
            <ul className='footer-links'>
              <li onClick={() => navigate('/?category=Công nghệ')}>💻 Công nghệ & Đám mây</li>
              <li onClick={() => navigate('/?category=Lập trình')}>⚙️ Kỹ thuật Lập trình</li>
              <li onClick={() => navigate('/?category=AI')}>🤖 Trí tuệ Nhân tạo & LLM</li>
              <li onClick={() => navigate('/?category=Cuộc sống')}>🌱 Cuộc sống & Sự nghiệp</li>
            </ul>
          </div>

          <div className='footer-link-group'>
            <h4 className='footer-link-title'>Điều hướng nhanh</h4>
            <ul className='footer-links'>
              <li onClick={() => navigate('/')}>Trang chủ</li>
              <li onClick={() => navigate('/create')}>Soạn bài viết mới</li>
              <li onClick={() => navigate('/my-blogs')}>Quản trị bài viết của tôi</li>
              <li onClick={() => navigate('/login')}>Cổng đăng nhập</li>
            </ul>
          </div>
        </div>
      </div>

      <div className='footer-bottom'>
        <div className='footer-bottom-inner'>
          <p className='footer-copyright'>
            © {new Date().getFullYear()} FullStack_Blogs (Spiderum Platform). Xây dựng với kiến trúc Type-Safe & Clean
            Code.
          </p>
          <span className='footer-status-pill'>🟢 Hệ thống hoạt động bình thường</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
