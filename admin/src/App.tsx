import { useState } from 'react'
import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import Login from './components/Login/Login'
import AdminUser from './components/AdminUser/AdminUser'
import LayoutAdmin from './components/LayoutAdmin/LayoutAdmin'
import AdminCategory from './components/AdminCategory/AdminCategory'
import AdminProduct from './components/AdminProduct/AdminProduct'
import AdminBill from './components/AdminBill/AdminBill'
import PrivateRouter from './components/PrivateRouter/PrivateRouter'




function App() {


  return (
    <>
   <Routes>
      <Route path='/' element={<Login />}></Route>
      <Route path='/admin' element={<LayoutAdmin> <Outlet /> </LayoutAdmin>}>
        <Route path='/admin' element={<PrivateRouter />} >
          <Route index path='user' element={<AdminUser />} />
          <Route path='category' element={<AdminCategory />} />
          <Route path='product' element={<AdminProduct />} />
          <Route path='bill' element={<AdminBill />} />
        </Route>
      </Route>
    </Routes>
    </>
  )
}

export default App
