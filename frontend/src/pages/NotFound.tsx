import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='notfound-page'>
      <div className='notfound-card'>
        <div className='notfound-icon'>🕸️</div>
        <span className='notfound-code'>404 ERROR</span>
        <h1 className='notfound-title'>Không tìm thấy trang yêu cầu</h1>
        <p className='notfound-desc'>
          Trang bạn đang truy cập không tồn tại, đã bị xóa hoặc liên kết bạn theo dõi có thể đã thay đổi.
        </p>
        <div className='notfound-actions'>
          <button onClick={() => navigate('/')} className='btn btn-primary btn-lg'>
            <span>Về trang chủ Spiderum</span>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
              <path d='M5 12h14M12 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
