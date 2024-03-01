import React, { useEffect, useState } from 'react';
import './CheckOut.css';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { publicAxios } from '../../config/publicAxios';
import { useDispatch } from 'react-redux';
import { getCart } from '../../store/reducer/reducer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UserInfo {
  name: string;
  phone: string;
  email: string;
  note: string;
}

interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

export default function CheckOut() {
  const userLogin: any = JSON.parse(localStorage.getItem('user_login') || '{}');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [infoBill, setInfoBill] = useState<UserInfo>({
    name: '',
    phone: '',
    email: '',
    note: '',
  });

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [provinces, setProvinces]:any = useState<Province[]>([]);
  const [districts, setDistricts]:any = useState<District[]>([]);
  const [wards, setWards]:any = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState<string | number>();
  const [districtCode, setDistrictCode] = useState<string | number>();
  const [wardCode, setWardCode] = useState<string | number>();

  let total = cart.reduce((total, current) => {
    return total + current.price * current.quantity;
  }, 0);

  const getProvinces = async () => {
    let result = await axios.get('https://vapi.vnappmob.com/api/province/');
    setProvinces(result.data.results);
  };

  const handleSelectProvince = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const nameCity = provinces.find((item:any)=>item.province_name==provinceCode)
    let result = await axios.get(`https://vapi.vnappmob.com/api/province/district/${nameCity.province_id}`);
    
    setProvinceCode(nameCity.province_name);
    setDistricts(result.data.results);
    setDistrictCode(-1);
    setWards([]);
    setWardCode(-1);
  };

  const handleSelectDistrict = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value
    const nameDistrict = districts.find((item:any)=>item.district_name==districtCode);
    let result = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${nameDistrict.district_id}`);
    
    
    setDistrictCode(nameDistrict.district_name);
    setWards(result.data.results);
    setWardCode(-1);
  };

  const checkOut = async () => {
    if (!provinceCode || !districtCode || !wardCode) {
      message.error('Điền đủ thông tin địa chỉ');
      return;
    }

    
    

    // const provinceName = provinces.find((e:any) => e.code === provinceCode)?.province_name || '';
    // const districtName = districts.find((e:any) => e.code === districtCode)?.district_name || '';
    // const wardName = wards.find((e:any) => e.code === wardCode)?.ward_name || '';

    // console.log(provinceCode, districtCode, wardCode);

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = String(today.getFullYear());
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    const bill = {
      ...infoBill,
      address: `${wardCode}:${districtCode}:${provinceCode}`,
      cart,
      total,
      userId: userLogin.userId,
      status: 0,
      createdAt: `${h}:${m}:${s}, ${dd}/${mm}/${yyyy}`,
    };

    if (bill.cart.length === 0) {
      message.error('Không có sản phẩm để mua');
      return;
    }

    if (!(/^0[13579]\d{8}$/.test(bill.phone))) {
      message.error('Chưa đúng định dạng số điện thoại');
      return;
    }

    if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(bill.email))) {
      message.error('Email không hợp lệ');
      return;
    }

    try {
      const result = await publicAxios.post('/api/v1/bill/creatBill', bill)
      console.log("44444",result.data);
      
      const billDetail = {
        billId: result.data.newIdBill.insertId,
        cart,
      };
      console.log(billDetail.billId);
      
      await publicAxios.post('/api/v1/billDetail', billDetail);
      await publicAxios.delete(`/api/v1/carts/${userLogin.userId}`);
      message.success('Thanh toán thành công');
      dispatch(getCart(userLogin?.userId));
      setCart([]);
      navigate('/bill');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProvinces();
  }, []);

  const getInfoProducts = async () => {
    const token = localStorage.getItem('token');
    const result = await publicAxios.get('/api/v1/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCart(result.data.data);
  };

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfoBill({ ...infoBill, [name]: value });
  };

  useEffect(() => {
    getInfoProducts();
  }, []);

  return (
    <div className='w-[1140px] m-auto mt-3 flex justify-between '>
      <div>
        <div>
          <h1 className='text-2xl font-bold'>Thông tin giao hàng</h1>
        </div>
        <div className='info-delivery'>
          <div className=''>
            <label>Tên</label>
            <input
              placeholder='Họ và tên'
              onChange={handleChangeInfo}
              value={infoBill.name}
              name='name'
            />
          </div>
          <div className='ml-1'>
            <label>Điện Thoại</label>
            <input
              placeholder='Số điện thoại'
              onChange={handleChangeInfo}
              value={infoBill.phone}
              name='phone'
            />
          </div>
        </div>
        <div className='info-email'>
          <label>Địa chỉ Email</label>
          <input
            type='email'
            placeholder='Địa chỉ Email'
            onChange={handleChangeInfo}
            value={infoBill.email}
            name='email'
          />
        </div>
        <div className='info-address'>
          <select onChange={handleSelectProvince} value={provinceCode || ''}>
            <option disabled value=''>Tỉnh</option>
            {provinces.map((item:any, index:any) => (
              <option key={index} value={item.code}>{item.province_name}</option>
            ))}
          </select>
          <select onChange={handleSelectDistrict} className='ml-3.5' value={districtCode || ''}>
            <option disabled value=''>Quận/Huyện</option>
            {districts.map((item:any, index:any) => (
              <option key={index} value={item.code}>{item.district_name}</option>
            ))}
          </select>
          <select onChange={(e) => setWardCode(e.target.value)} className='ml-3' value={wardCode || ''}>
            <option disabled value=''>Phường/Xã</option>
            {wards.map((item:any, index:any) => (
              <option key={index} value={item.code}>{item.ward_name}</option>
            ))}
          </select>
        </div>
        <div className='info-message'>
          <label>Lời nhắn</label>
          <textarea
            placeholder='Ghi chú thêm (Ví dụ:Giao hàng giờ hành chính)'
            onChange={handleChangeInfo}
            value={infoBill.note}
            name='note'
          />
        </div>
        <div>
          <button className='w-[258px] h-[50px] rounded-none bg-black hover:bg-red-200 mb-3 text-white'
            onClick={() => checkOut()}
          >
            ĐẶT HÀNG NGAY
          </button>
        </div>
      </div>
      <div className='total-cart'>
        <div>
          {cart.map((item) => (
            <div className='flex' key={item.id}>
              <div className='w-[100px] mb-2 rounded mr-3'>
                <img src={item.image} alt='product'></img>
              </div>
              <div>
                <span>{item.name}</span><br />
                <span>{Number(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                <div>
                  <span>Số lượng:</span>
                  <span className='ml-2'>{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
          <div className='flex justify-between'>
            <h2 className='font-bold text-xl'>TỔNG CỘNG</h2>
            <span className='text-red-500 font-bold text-xl'>{Number(total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
