
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import Login from './page/Login/Login'
import Register from './page/Register/Register'
import Products from './page/Products/Products'
import ProductDetail from './page/ProductDetail/ProductDetail'
import CartOrther from './page/CartOther/CartOrther'
import CheckOut from './page/CheckOut/CheckOut'
import Bill from './page/Bill/Bill'
import ProductCatergory from './page/ProductCatergory/ProductCatergory'
import { useState } from 'react'



function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);


  return (
    <>
       <Routes>
       <Route path='/' element={ <><Header setIsLoad={setIsLoad} isLogin={isLogin} setIsLogin={setIsLogin} /> <Outlet /> <Footer/></>}>
          <Route path="/" element={<Main />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLogin={setIsLogin}  />} />
          <Route path="/products" element={<Products  />}/>
          <Route path="/productDetail/:id" element={<ProductDetail />}/>
          <Route path="/cartOther" element={<CartOrther/>}/>
          <Route path="/checkOut" element={<CheckOut/>}/>
          <Route path="/bill" element={<Bill/>}/>
          <Route path="/category/:idCategory" element={<ProductCatergory isLoad={isLoad} />}/>
        </Route>
       </Routes>
    </>
  )
}

export default App
