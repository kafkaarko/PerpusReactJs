import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Layout from './pages/components/Layout'
import Home from './pages/Home'
import MemberIndex from './pages/Member'
import BookIndex from './pages/buku'
import MinjamIndex from './pages/peminjaman'
import DendaIndex from './pages/denda'
import GrafikIndex from './pages/grafik'
import IsLogin from './pages/middleware/isLogin'
import RiwayatIndex from './pages/riwayat'



function App() {

  return (
    <>

    <Routes>
        <Route index element={<Login />} />

        <Route path="/" element={
          <IsLogin>
            <Layout/>
          </IsLogin>
          }>
        <Route path='home' element={<Home/>}/>
        <Route path='memberIndex' element={<MemberIndex/>}/>
        <Route path='bukuIndex' element={<BookIndex/>}/>
        <Route path='minjamIndex' element={<MinjamIndex/>}/>
        <Route path='dendaIndex' element={<DendaIndex/>}/>
        <Route path='grafikIndex' element={<GrafikIndex/>}/>
        <Route path='riwayatIndex' element={<RiwayatIndex/>}/>
        </Route>
      </Routes>

      
    </>
  )
}

export default App
