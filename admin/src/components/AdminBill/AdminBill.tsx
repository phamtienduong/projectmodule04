import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { publicAxios } from '../../config/publicAxios';
import { formatCurrency } from '../../helper/formatMoney';


interface CartItem {
    nameProduct: string;
    quantity: number;
    price: number;
    image: string;
    description: string;
}

interface Bill {
    userId: number;
    totalPrice: number;
    status: string;
    phoneNumber: string;
    createdAt: string;
    bilId: number;
    address: string;
    cart: CartItem[];
}

export default function AdminBill() {
    const [bills, setBills] = useState<Bill[]>([]);

    const renderColumns = [
        {
            title: 'UserId',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'TotalPrice',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price: number) => <>{ formatCurrency(+price)} </>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'PhoneNumber',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'BilId',
            dataIndex: "bilId",
            key: 'bilId',
        },
        {
            title: 'Address',
            key: 'address',
            dataIndex: "address"
        },
        {
            title: 'Cart',
            key: 'cart',
            dataIndex: "cart",
            render: (cart: CartItem[]) => (
              <>
                <div style={{ height: 200, overflowY: "scroll" }}>
                    {cart.map((item, index) => (
                        <div key={index} style={{ borderBottom: "1px solid #333" }}>
                            <p>{item.nameProduct} | {item.quantity} | {item.price} </p>
                            <p>
                                <img width={100} src={item.image} alt='' />
                            </p>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
              </>
                
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (bill: Bill) => (
                <div>{bill.status === "đang xử lý" ? <div>
                    <Button onClick={() => handleAccept(bill.bilId)}>Chấp Nhận</Button>
                    <Button onClick={() => handleDeny(bill.bilId)}>Từ chối</Button>
                </div> : <></>}</div>
            )
        }
    ];

    const getBills = async () => {
        try {
            const response = await publicAxios.get("/api/v1/bills");
            const data: Bill[] = response.data.data;
            let result:any = []
        for(let  i = 0; i < data.length; i++) {
            const bill: any = data[i]
            let resultItem = {}
            let cart = []
            for(let j = 0; j < bill.length; j++) {
                // const {}
                const {
                    userId, bilId, address, phoneNumber , status, totalPrice, createdAt,
                    stock, categoryId, productId, billId,
                    ...data
                } = bill[j]
                resultItem = {userId, bilId, address, phoneNumber , status, totalPrice, createdAt}
                cart.push(data)
            }
            resultItem = {...resultItem, cart}
            result.push(resultItem)
        }

            setBills(result);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeny = async (id: number) => {
        try {
            const response = await publicAxios.patch(`/api/v1/bills/admindeny`, {
                bilId: id
            });
            getBills();
        } catch (error) {
            console.log(error);
        }
    }

    const handleAccept = async (id: number) => {
        try {
            const response = await publicAxios.patch(`/api/v1/bills/adminaccept`, {
                bilId: id
            });
            if (response.data.result.affectedRows) {
                getBills();
            } else {
                message.error("failure");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBills();
    }, []);

    return (
        <div>
            <div className="col-12">
                <div className="page-title-box">
                    <h4 className="page-title" style={{ fontSize: 50 }}>Quản lý đơn hàng</h4>
                </div>
            </div>
            <Table style={{ marginBottom: "20px" }} dataSource={bills} columns={renderColumns} />
        </div>
    );
}
