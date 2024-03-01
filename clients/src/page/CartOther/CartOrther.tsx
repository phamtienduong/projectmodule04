import React, { useEffect, useState } from "react";
import "./CartOther.css";
import { useNavigate } from "react-router-dom";
import { Button, message, Popconfirm } from "antd";
import { publicAxios } from "../../config/publicAxios";
import { useDispatch } from "react-redux";
import { getCart } from "../../store/reducer/reducer";


interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export default function CartOther() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [flag, setFlag] = useState<boolean>(false);
  const dispatch = useDispatch()
  const userLogin = JSON.parse(localStorage.getItem("user_login") || "");

  let totalMoney = cart.reduce((total, current) => {
    return total + current.quantity * current.price;
  }, 0);

  const navigate = useNavigate();

  const getInfoProducts = async () => {
    const token = localStorage.getItem("token");
    const result = await publicAxios.get(`/api/v1/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCart(result.data.data);
    setFlag(!flag);
  };

  const handleClickProduct = (id: number) => {
    localStorage.setItem("idProductDetail", id.toString());
    navigate(`/productDetail/${id}`);
  };

  const confirm = async (e: any, id: number) => {
    const token = localStorage.getItem("token");
    const result = await publicAxios.delete(
      `/api/v1/cart/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(getCart(userLogin?.userId));
    
    if (result.status === 200) {
      getInfoProducts();
    }
    
  };

  const cancel = (e: any) => { };

  const handleIncrease = async (id: number) => {
    const body = { cartId: +id, type: "incre" };
    try {
      await publicAxios.patch(`/api/v1/cart/quantity`, body);
      setFlag(!flag);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrease = async (id: number) => {
    const body = { cartId: id, type: "decre" };
    try {
      await publicAxios.patch(`/api/v1/cart/quantity`, body);
      setFlag(!flag);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    navigate("/checkout");
  };

  const handleByMore = () => {
    navigate("/products");
  };

  useEffect(() => {
    getInfoProducts();
  }, [flag]);

  return (
    <div className="w-[1140px] m-auto ">
      <div className="text-center mb-4">
        <h1 className="font-bold text-3xl">Giỏ hàng của bạn</h1>
        <span>Có {cart.length} sản phẩm trong giỏ hàng</span>
      </div>
      <div className="container-cart">
        <div className="list_product">
          <table className="table-auto" cellPadding={10} cellSpacing={10}>
            <thead className=" thead-cart  h-[60.4px] text-center rounded">
              <tr>
                <th>Hình ảnh</th>
                <th>Thông tin</th>
                <th>Số lượng</th>
                <th>Giá tiền</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item: any) => (
                <tr key={item.id} className="text-center">
                  <td className="w-[86.77px] h-[115.15px] rounded">
                    <img width={100} src={item.image} alt="img"></img>
                  </td>
                  <td>
                    <span>{item.name}</span> <br></br>
                    <span
                      onClick={() => handleClickProduct(item.productId)}
                      className="underline decoration-2 text-blue-500 cursor-pointer"
                    >
                      Xem lại
                    </span>
                  </td>
                  <td>
                    <button className="btn-quantity" onClick={() => handleDecrease(item.cartId)}>
                      -
                    </button>
                    <span className="ml-4 mr-4">{item.quantity}</span>
                    <button className="btn-quantity" onClick={() => handleIncrease(item.cartId)}>
                      +
                    </button>
                  </td>
                  <td className="">
                    {Number(item.price).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>
                    <Popconfirm
                      title="Xoá nghiệm vụ"
                      description="Bạn có muốn xoá sản phẩm?"
                      onConfirm={(e) => confirm(e, item.productId)}
                      onCancel={cancel}
                      okText="Đồng ý"
                      cancelText="Không đồng ý"
                    >
                      <div className="w-[25px] h-[25px] rounded bg-red-700 text-white">
                        &times;
                      </div>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-summary">
          <div className="content-order">
            <div className="name-order-summary border-b-2">
              <h1 className="text-xl mb-4">Tóm tắt đơn hàng</h1>
            </div>
            <div className="flex justify-between mt-4 pb-4 border-b-2 mb-4">
              <span>Tạm tính:</span>
              <span>
                {Number(totalMoney).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                đ
              </span>
            </div>
            <div className="flex justify-between mt-4 pb-4 border-b-2 mb-4">
              <span>Tổng tiền</span>
              <span>
                {Number(totalMoney).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                đ
              </span>
            </div>
            <div className="">
              <button
                className="w-[302px] h-[48px] rounded-none bg-red-600 hover:bg-red-200 mb-3 text-white "
                onClick={() => handleCheckout()}
              >
                TIẾN HÀNH ĐẶT HÀNG
              </button>
              <button
                className="w-[302px] h-[48px] rounded-none bg-stone-200 hover:bg-red-200 "
                onClick={() => handleByMore()}
              >
                MUA THÊM SẢN PHẨM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
