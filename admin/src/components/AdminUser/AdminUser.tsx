import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { publicAxios } from "../../config/publicAxios";

interface User {
  userId: number;
  email: string;
  userName: string;
  phone: string;
  status: number;
}

const renderColumns = (handleChangeActive: (user: User) => void) => [
  {
    title: 'ID',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Tên Người Dùng",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "Số Điện Thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Trạng Thái",
    dataIndex: "status",
    key: "status",
    render: (status: number) => (
      <span>{status === 0 ? "Active" : "Ban"}</span>
    ),
  },
  {
    title: "Tính năng",
    render: (_: any, user: User) => (
      <Button onClick={() => handleChangeActive(user)}>
        {user.status === 0 ? "Ban" : "Active"}
      </Button>
    ),
  },
];

export default function AdminUser() {
  const [listUser, setListUser] = useState<User[]>([]);

  const getUser = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await publicAxios.get(
        "/api/v1/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      
      if (response.data.result) {
        setListUser(response.data.result);
      }
    } catch (error) {
      console.log(error);
      // Xử lý lỗi khi gọi API
    }
  };

  const handleChangeActive = async (user: User) => {
    const token = localStorage.getItem("admin_token");
    try {
      const res1 = await publicAxios.patch(
        `/api/v1/users/status/${user.userId}`,
        {
          id: user.userId,
          status: 1 - user.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res1);
      getUser();
    } catch (error) {
      console.log(error);
      // Xử lý lỗi khi gọi API
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <div className="col-12">
        <div className="page-title-box">
          <h4 className="page-title" style={{ fontSize: 50 }}>
            Quản lý người dùng
          </h4>
        </div>
      </div>
      <Table dataSource={listUser} columns={renderColumns(handleChangeActive)} />
    </div>
  );
}
