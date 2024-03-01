import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./Bill.css";
import { Button, message, Popconfirm, Table } from 'antd';
import { formatCurrency } from '../../helper/formatMoney';

interface Product {
    nameProduct: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
}

interface BillItem {
    userId: number;
    bilId: number;
    address: string;
    phoneNumber: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    cart: Product[];
}

function Bill() {
    const [bills, setBills] = useState<BillItem[]>([]);

    const getBills = async () => {
        const userLogin = JSON.parse(localStorage.getItem("user_login") || "");
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/bill/${userLogin.userId}`);
            const listBillDetail: any[] = response.data.data;

            const listIdBill: number[] = [];
            for (const item of listBillDetail) {
                if (!listIdBill.includes(item.bilId)) {
                    listIdBill.push(item.bilId);
                }
            }

            const data: any[] = [];
            for (const id of listIdBill) {
                const billDetails = listBillDetail.filter(item => item.bilId === id);
                data.push(billDetails);
            }

            const result: BillItem[] = [];
            for (let i = 0; i < data.length; i++) {
                const bill = data[i];
                let resultItem: Partial<BillItem> = {};
                const cart: Product[] = [];
                for (let j = 0; j < bill.length; j++) {
                    const {
                        userId, bilId, address, phoneNumber , status, totalPrice, createdAt, ...product
                    } = bill[j];
                    resultItem = {userId, bilId, address, phoneNumber , status, totalPrice, createdAt};
                    cart.push(product as Product);
                }
                resultItem.cart = cart;
                result.push(resultItem as BillItem);
            }
            setBills(result);
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    };

    const handleDeny = async (id: number) => {
        try {
            await axios.patch(`http://localhost:8080/api/v1/bills/userdeny`, {
                bilId: id
            });
            getBills();
        } catch (error) {
            console.error("Error denying bill:", error);
        }
    };

    useEffect(() => {
        getBills();
    }, []);

    const renderColumns = [
        {
            title: 'userId',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'totalPrice',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price: number) => <>{ formatCurrency(+price)} </>

        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'phoneNumber',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'bilId',
            dataIndex: "bilId",
            key: 'bilId',
        },
        {
            title: 'address',
            key: 'address',
            dataIndex:"address"
        },
        {
            title: 'cart',
            key: 'cart',
            dataIndex:"cart",
            render: (cart: Product[]) => (
                <div style={{height: 200, overflowY: "scroll"}}>{cart.map((item, index) => (
                    <div key={index} style={{borderBottom: "1px solid #333"}}>
                        <p>{item.nameProduct} | {item.quantity} | {item.price} </p>
                        <p>
                            <img width={100} src={item.image} alt='' />
                        </p>
                        <p>{item.description}</p>
                    </div>
                ))}</div>
            )
        },
        {
            title: 'action',
            key: 'action',
            width: 100,
            render: (bill: BillItem) => (
                <div>{bill.status === "đang xử lý" ? <div>
                    <Button onClick={() => handleDeny(bill.bilId)}>Từ Chối</Button>
                </div> : <></>}</div>
            )
        }
    ];

    return (
        <div>
            <Table style={{marginBottom:"20px"}} dataSource={bills} columns={renderColumns} />
        </div>
    );
}

export default Bill;
