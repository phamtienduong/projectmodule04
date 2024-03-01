import { Link, useNavigate } from "react-router-dom"
import "./Login.css"
import { ChangeEvent, FormEvent, useState } from "react"
import { notification } from "antd"
import { publicAxios } from "../../config/publicAxios"
interface User {
  email:string,
  password:string
}
export default function Login({ setIsLogin }: { setIsLogin: any }) {
  const navigate = useNavigate()
  const [user,setUser] = useState<User>({
    email:"",
    password:""
  })
  const handleChange = (e:ChangeEvent<HTMLInputElement>):void =>{
    setUser({...user,[e.target.name]: e.target.value})
  }
  const handleLogin = async (e:FormEvent)=>{
    console.log(user)
    e.preventDefault()
    if (!user.email || !user.password) {
      notification.error({
        message: 'Vui lòng nhập thông tin',
      })
      return;
    }
    // Xử lý đăng nhập
    try {
      const res = await publicAxios.post("/api/v1/auth/login",user)
      notification.success(res.data)
      if (res.data.token) {
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("user_login",JSON.stringify(res.data.result));
        setIsLogin(true)
        navigate("/")
        window.location.reload()
      }
    } catch (error:any) {
      // console.log(error);
      notification.error(error.response.data)
    }
  }  
  return (
    <div>
        <div className="formLogin">
        <h1 className="text-4xl font-bold" id="formTitle">
          Đăng nhập
        </h1>
        <div className="inputLogin">
          <form>
            <label htmlFor="email" />
            <br />
            <input
              type="text"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <br />
            <label htmlFor="password" />
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
            />
            <br />
            <button onClick={handleLogin}  type="button"> Đăng nhập</button>
            <div className="login-register">
              <p>
                Không có tài khoản?
                <Link
                to="/register"
                  className="register-link underline decoration-2 text-blue-500"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
