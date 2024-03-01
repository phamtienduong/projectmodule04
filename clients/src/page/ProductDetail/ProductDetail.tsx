import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import Slider from "react-slick";
import { publicAxios } from "../../config/publicAxios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { getCart } from "../../store/reducer/reducer";

interface Product {
  productId: number;
  nameProduct: string;
  image: string;
  price: number;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const idProductDetail = localStorage.getItem("idProductDetail");
  const [productDetail, setProductDetail] = useState<Product | null>(null);


  const getProduct = async () => {
    try {
      const result = await publicAxios.get(
        `api/v1/products/${Number(idProductDetail)}`
      );
      setProductDetail(result.data.data);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    let userLogin: any = localStorage.getItem("user_login")
    if (!token || !userLogin) {
      message.error("Bạn chưa đăng nhập");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    userLogin = JSON.parse(userLogin) || ""

    try {
      const result = await publicAxios.post(
        "/api/v1/cart",
        { productId: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log(result);
      dispatch(getCart(userLogin?.userId));

      message.success(result.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error(
        "Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại sau."
      );
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <main style={{ position: "relative" }}>
        <div className="main mt-[-75px]">
          <div className="main_img">
            <div className="img_sale">
              <div className="img_sale_1">
                <span>SALE 50%</span>
              </div>
              <img src="../../../src/assets/img/anh_sale.webp" alt="img" />
            </div>
            <img id="img_product" src={productDetail?.image} alt="img" />
          </div>
          <div className="detail-container">
            <div className="detail-product-wrap">
              <div className="main_product">
                <h1 id="name_product">{productDetail?.nameProduct}</h1>
                <span>
                  SKU: <span id="id_product">{productDetail?.productId}</span>
                </span>
              </div>
              <div className="main_product_price">
                <span id="price_product">
                  {Number(productDetail?.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
            <div className="wrap-addcart">
              <button
                onClick={() => handleAddToCart(productDetail?.productId || 0)}
                className="btn-cart w-[479.33px] h-[56px]"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
            <div className="product-description">
              <p>
                <strong>Chất liệu:&nbsp;</strong>vải tweed
              </p>
              <br />
              <p>
                <strong>Kiểu dáng:&nbsp;</strong>váy mini thiết kế dáng chữ A,
                cỏ tròn, eo đính nơ bản to
              </p>
              <br />
              <p>
                <strong>Sản phẩm kết hợp:</strong> áo tay bèo H313 - áo dài tay
                H272
              </p>
              <br />
              <p>
                <strong>Thông tin người mẫu:</strong> cao 1m60, số đo 84 - 60 -
                90 mặc sản phẩm size S
              </p>
              <br />
            </div>
          </div>
        </div>
        {/* Swiper */}
        
      </main>
    </div>
  );
}
