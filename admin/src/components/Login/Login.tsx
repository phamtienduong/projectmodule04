import React, { ChangeEvent, FormEvent, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { publicAxios } from "../../config/publicAxios";
import { message } from "antd";
interface User {
  email: string;
  password: string;
}
export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleLogin = async () => {
    try {
      const res = await publicAxios.post("/api/v1/auth/login", user);
      console.log(res);
      if (res.data.result.role !== 1) {
        message.error("Bạn không có quyền đăng nhập vào admin");
        return;
      }
      if (res.data.message === "Đăng nhập thành công") {
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("user_login", JSON.stringify(res.data.result));
        message.success(res.data.message);
        navigate("admin");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <div className="formLogin">
          <h1
            className="formTitle text-2xl font-bold"
            id="formTitle"
            style={{ padding: 0 }}
          >
            Đăng nhập
          </h1>
          <div className="inputLogin">
            <form>
              <label htmlFor="email" />
              <br />
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Email đăng nhập"
                required
              />
              <br />
              <label htmlFor="password" />
              <br />
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Mật khẩu"
                required
              />
              <br />
              <button type="button" onClick={handleLogin}>
                {" "}
                Đăng nhập
              </button>
              {/* <div className="login-register">
                            <p>Không có tài khoản?<Link to="/register" className="register-link underline decoration-2 text-blue-500">Đăng ký</Link></p>
                        </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
