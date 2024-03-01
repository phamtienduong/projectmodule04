import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./Register.css";
import { notification } from "antd";
import { publicAxios } from "../../config/publicAxios";
import { useNavigate } from "react-router-dom";

interface User {
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
export default function Register() {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState<User>({
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errorInput, setErrorInput] = useState({
    errName: "",
    errEmail: "",
    errPhone: "",
    errPass: "",
    errConfirm: "",
  });
  const validateInput = () => {
    const regexName = /^.{6,}$/;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const regexPhone = /^(0|\+84)\d{9,10}$/;
    const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    let check = true;
    const err = {
      errName: "",
      errEmail: "",
      errPhone: "",
      errPass: "",
      errConfirm: "",
    };

    if (!regexName.test(nameInput.userName.trim())) {
      err.errName = "Tên có 6 ký tự trở lên";
      check = false;
    }

    if (!regexEmail.test(nameInput.email)) {
      err.errEmail = "Chưa đúng định dạng email";
      check = false;
    }

    // Add logic to check for duplicate email in the users array

    if (!regexPhone.test(nameInput.phone)) {
      err.errPhone = "Chưa đúng định dạng Phone VN";
      check = false;
    }

    if (!regexPass.test(nameInput.password)) {
      err.errPass = "Mật khẩu ít nhất 6 ký tự chứa cả chữ cái và số";
      check = false;
    }

    if (!(nameInput.password === nameInput.confirmPassword)) {
      err.errConfirm = "Nhập lại mật khẩu cho đúng";
      check = false;
    }

    setErrorInput(err);
    return check;
  };
  const handleGetValue = (e: ChangeEvent<HTMLInputElement>) => {
    setNameInput({ ...nameInput, [e.target.name]: e.target.value });
  };
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !nameInput.userName ||
      !nameInput.email ||
      !nameInput.phone ||
      !nameInput.password
    ) {
      notification.error({
        message: "Vui lòng nhập đủ thông tin",
      });
      return;
    }
    let isValidate = validateInput();
    if (isValidate) {
      try {
        const res = await publicAxios.post("api/v1/auth/register", nameInput);
        console.log(res.data);
        notification.success(res.data);
        navigate("/login");
      } catch (error: any) {
        notification.error(error.response.data);
      }
    }
  };
  useEffect(() => {
    handleRegister;
  }, []);

  return (
    <div>
      <div className="formRegister">
        <h1 className="text-4xl font-bold" id="formTitle">
          Đăng ký
        </h1>
        <div className="inputRegister">
          <form autoComplete="off">
            <div className="input_scope">
              <label htmlFor="username" />
              <br />
              <input
                type="text"
                name="userName"
                value={nameInput.userName}
                onChange={handleGetValue}
                placeholder="Tên đăng nhập"
                required
              />
              <p id="userName-error" style={{ paddingLeft: 150, color: "red" }}>
                {errorInput.errName}
              </p>
              <br />
            </div>
            <div className="input_scope">
              <label htmlFor="email" />
              <br />
              <input
                type="email"
                name="email"
                value={nameInput.email}
                onChange={handleGetValue}
                placeholder="Email"
                required
              />
              <p id="email-error" style={{ paddingLeft: 150, color: "red" }}>
                {errorInput.errEmail}
              </p>
              <br />
            </div>
            <div className="input_scope">
              <label htmlFor="phone" />
              <br />
              <input
                type="text"
                name="phone"
                value={nameInput.phone}
                onChange={handleGetValue}
                id="phone"
                placeholder="Số điện thoại"
                required
              />
              <p id="phone-error" style={{ paddingLeft: 150, color: "red" }}>
                {errorInput.errPhone}
              </p>
              <br />
            </div>
            <div className="input_scope">
              <label htmlFor="password" />
              <br />
              <input
                type="password"
                name="password"
                value={nameInput.password}
                onChange={handleGetValue}
                placeholder="Mật khẩu"
                required
              />
              <p
                id="password-error"
                style={{ paddingLeft: 150, color: "red" }}
              >{errorInput.errPass}</p>
              <br />
            </div>
            <div className="input_scope">
              <label htmlFor="confirmPassword" />
              <br />
              <input
                type="password"
                name="confirmPassword"
                value={nameInput.confirmPassword}
                onChange={handleGetValue}
                placeholder="Nhập lại mật khẩu"
                required
              />
              <p
                id="confirm-password-error"
                style={{ paddingLeft: 150, color: "red" }}
              >{errorInput.errConfirm}</p>
              <br />
            </div>
            <button onClick={handleRegister} className="mt-4" type="button">
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
