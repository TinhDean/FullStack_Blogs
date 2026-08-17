export interface Blog {
  _id: string
  title: string
  content: string
  category?: string
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

export const getAllBlogs = async (category?: string, page?: number, limit?: number) => {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (page) params.append('page', String(page))
  if (limit) params.append('limit', String(limit))

  const queryString = params.toString()
  const url = queryString ? `${API}?${queryString}` : API
  const res = await fetch(url)

  return res.json()
}

export const getBlogById = async (id: string) => {
  const res = await fetch(`${API}/${id}`)

  return res.json()
}

export const likeBlog = async (id: string) => {
  const res = await fetch(`http://localhost:5000/api/blogs/${id}/like`, {
    method: 'PATCH'
  })
  return res.json()
}

export const increaseView = async (id: string) => {
  const res = await fetch(`${API}/${id}/view`, {
    method: 'PATCH'
  })

  return res.json()
}

export const searchBlogs = async (keyword: string) => {
  const res = await fetch(`http://localhost:5000/api/blogs/search?search=${keyword}`)

  return res.json()
}

export const getComments = async (blogId: string) => {
  const res = await fetch(`http://localhost:5000/api/comments/${blogId}`)

  return res.json()
}

export const createComment = async (blogId: string, content: string) => {
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

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Gửi comment thất bại')
  }

  return res.json()
}

export const createBlog = async (title: string, content: string, category: string) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      title,
      content,
      category
    })
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Tạo bài viết thất bại')
  }

  return res.json()
}

export const updateBlog = async (id: string, title: string, content: string, category: string) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      title,
      content,
      category
    })
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Cập nhật bài viết thất bại')
  }

  return res.json()
}

export const deleteBlog = async (id: string) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Xóa bài viết thất bại')
  }

  return res.json()
}

export const loginUser = async (email: string, password: string) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Đăng nhập thất bại')
  }

  return res.json()
}

export const registerUser = async (username: string, email: string, password: string) => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Đăng ký thất bại')
  }

  return res.json()
}
