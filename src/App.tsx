import {Routes, Route, useNavigate} from 'react-router-dom'
import Login from './components/Login'
import Home from './container/Home'
import { useEffect } from 'react'

const App = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    
    if (!userData) {
      navigate('/login')
      return
    } 
    const user = JSON.parse(userData)
    if (!user._id) {
      navigate('/login')
      return
    }


  }, [])
  
  return (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='/*' element={<Home />} />
    </Routes>
  )
}

export default App