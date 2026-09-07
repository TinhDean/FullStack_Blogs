export interface Blog {
  _id: string
  title: string
  content: string
  category?: string
  thumbnail?: string
  likes: number
  views: number
  createdAt: string
  author?: {
    _id: string
    username: string
  }
}

export interface Comment {
  _id: string
  blogId: string
  userId?: string
  username: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  username: string
  email: string
  role: string
}

const API = 'http://localhost:5000/api/blogs'

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const handleResponse = async <T>(res: Response, fallbackMessage: string): Promise<T> => {
  if (!res.ok) {
    let errorMessage = fallbackMessage
    try {
      const errorData = await res.json()
      errorMessage = errorData.message || errorData.error || fallbackMessage
    } catch {
      errorMessage = res.statusText || fallbackMessage
    }
    throw new Error(errorMessage)
  }
  return res.json()
}

export const getAllBlogs = async (category?: string, page?: number, limit?: number) => {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (page) params.append('page', String(page))
  if (limit) params.append('limit', String(limit))

  const queryString = params.toString()
  const url = queryString ? `${API}?${queryString}` : API
  const res = await fetch(url)

  return handleResponse<any>(res, 'Lấy danh sách bài viết thất bại')
}

export const getBlogById = async (id: string): Promise<Blog> => {
  const res = await fetch(`${API}/${id}`)

  return handleResponse<Blog>(res, 'Không tìm thấy bài viết')
}

export const likeBlog = async (id: string) => {
  const res = await fetch(`http://localhost:5000/api/blogs/${id}/like`, {
    method: 'PATCH'
  })
  return handleResponse<Blog>(res, 'Thích bài viết thất bại')
}

export const increaseView = async (id: string) => {
  const res = await fetch(`${API}/${id}/view`, {
    method: 'PATCH'
  })

  return handleResponse<Blog>(res, 'Cập nhật lượt xem thất bại')
}

export const searchBlogs = async (keyword: string): Promise<Blog[]> => {
  const res = await fetch(`http://localhost:5000/api/blogs/search?search=${encodeURIComponent(keyword)}`)

  return handleResponse<Blog[]>(res, 'Tìm kiếm bài viết thất bại')
}

export const getComments = async (blogId: string): Promise<Comment[]> => {
  const res = await fetch(`http://localhost:5000/api/comments/${blogId}`)

  return handleResponse<Comment[]>(res, 'Lấy danh sách bình luận thất bại')
}

export const createComment = async (blogId: string, content: string): Promise<Comment> => {
  const res = await fetch('http://localhost:5000/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      blogId,
      content
    })
  })

  return handleResponse<Comment>(res, 'Gửi comment thất bại')
}

export const createBlog = async (title: string, content: string, category: string, thumbnail?: string): Promise<Blog> => {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      title,
      content,
      category,
      thumbnail: thumbnail ? thumbnail.trim() : ''
    })
  })

  return handleResponse<Blog>(res, 'Tạo bài viết thất bại')
}

export const updateBlog = async (id: string, title: string, content: string, category: string, thumbnail?: string): Promise<Blog> => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      title,
      content,
      category,
      thumbnail: thumbnail !== undefined ? thumbnail.trim() : undefined
    })
  })

  return handleResponse<Blog>(res, 'Cập nhật bài viết thất bại')
}

export const deleteBlog = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  })

  return handleResponse<{ message: string }>(res, 'Xóa bài viết thất bại')
}

export const loginUser = async (email: string, password: string) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  return handleResponse<{ token: string; user: User }>(res, 'Đăng nhập thất bại')
}

export const registerUser = async (username: string, email: string, password: string) => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })

  return handleResponse<{ token: string; user: User }>(res, 'Đăng ký thất bại')
}

export const getMe = async (): Promise<{ user: User }> => {
  const res = await fetch('http://localhost:5000/api/auth/me', {
    headers: {
      ...getAuthHeaders()
    }
  })

  return handleResponse<{ user: User }>(res, 'Xác thực thất bại')
}

export interface BlogStats {
  totalBlogs: number
  totalViews: number
  totalLikes: number
}

export interface MyBlogsResponse {
  blogs: Blog[]
  stats: BlogStats
}

export const getMyBlogs = async (): Promise<MyBlogsResponse> => {
  const res = await fetch(`${API}/user/me`, {
    headers: {
      ...getAuthHeaders()
    }
  })

  return handleResponse<MyBlogsResponse>(res, 'Lấy danh sách bài viết thất bại')
}

export const deleteComment = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  })

  return handleResponse<{ message: string }>(res, 'Xóa bình luận thất bại')
}




