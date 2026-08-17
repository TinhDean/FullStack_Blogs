import { Routes, Route } from 'react-router-dom'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <div className='app-container'>
      <Navbar />

      <Routes>
        <Route path='/' element={<BlogList />} />
        <Route path='/blog/:id' element={<BlogDetail />} />
        <Route path='/blog/:id/edit' element={<EditBlog />} />
        <Route path='/create' element={<CreateBlog />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
