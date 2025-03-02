import { useEffect} from 'react'

import { Routes, Route, Navigate } from "react-router";
import { Home } from './pages/Home';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Navbar } from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore';

function App() {
  const {userAuth, isCheck, isChecking, onlineUser} = useAuthStore()
  const {selectedTheme} = useThemeStore()
  useEffect(()=>{
    isCheck()
  }, [isCheck])
  
  if(isChecking && !userAuth){
    return (
      <div className='flex justify-center items-center  h-screen'>
        <span className="loading loading-spinner loading-lg"></span>

      </div>
    )
  }
  // console.log(userAuth)
  console.log({onlineUser})
  return (
    <div data-theme={selectedTheme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={userAuth? <Home/> : <Navigate to={'/login'}/>}/>
        <Route path='/signup' element={!userAuth? <Signup/> : <Navigate to={'/'}/>}/>
        <Route path='/login' element={!userAuth? <Login/> : <Navigate to={'/'}/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/profile' element={userAuth ? <Profile/> : <Navigate to={'/login'}/> }/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
