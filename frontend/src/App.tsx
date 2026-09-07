import { Routes, Route } from 'react-router-dom'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBlogs from './pages/MyBlogs'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className='app-container'>
      <Navbar />

      <Routes>
        <Route path='/' element={<BlogList />} />
        <Route path='/blog/:id' element={<BlogDetail />} />
        <Route
          path='/blog/:id/edit'
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path='/create'
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path='/my-blogs'
          element={
            <ProtectedRoute>
              <MyBlogs />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
