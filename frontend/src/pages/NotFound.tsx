import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '24px'
      }}
    >
      <div style={{ fontSize: '72px', marginBottom: '16px' }}>🕸️</div>
      <h1
        style={{
          fontSize: '36px',
          fontWeight: '900',
          color: 'var(--text-title)',
          marginBottom: '12px',
          letterSpacing: '-1px'
        }}
      >
        404 - Không tìm thấy trang
      </h1>
      <p
        style={{
          fontSize: '16px',
          color: 'var(--text-muted)',
          maxWidth: '460px',
          marginBottom: '28px',
          lineHeight: '1.6'
        }}
      >
        Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đã chuyển sang địa chỉ khác.
      </p>
      <button onClick={() => navigate('/')} className='btn btn-primary'>
        Quay lại trang chủ
      </button>
    </div>
  )
}

export default NotFound
