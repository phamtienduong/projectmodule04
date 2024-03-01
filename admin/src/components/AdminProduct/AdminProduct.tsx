import React, { useState, useEffect } from 'react';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { Button, Image, Table, Modal, Form, Input, Select, message, Popconfirm, Space } from 'antd';
import { storage } from '../../firebase/firebase';
import { publicAxios } from '../../config/publicAxios';
import { formatCurrency } from '../../helper/formatMoney';
import "./AdminProduct.scss"

interface Product {
    productId: number;
    image: string;
    nameProduct: string;
    description: string;
    price: number;
    stock: number;
}

interface Category {
    categoryId: number;
    nameCategory: string;
}

export default function AdminProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productUpdate, setProductUpdate] = useState<Product | undefined>();
    const [fileImage, setFileImage] = useState<File>();
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
        setProductUpdate(undefined);
    };

    const getCategories = async () => {
        const result = await publicAxios.get("/api/v1/categories");  
        setCategories(result.data);
    };

    const getProducts = async () => {
        const result = await publicAxios.get("/api/v1/products");
        setProducts(result.data.data.reverse());
    };

    useEffect(() => {
        getCategories();
        getProducts();
    }, []);

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileImage(e.target.files[0]);
        }
    };
    const handleChangeCategory = (value:any) => { 
        
    };

    const onFinish = async (values: any) => {
        if (productUpdate) {
            let newProduct: Product;
            if (fileImage) {
                const imageRef = ref(storage, `image/${fileImage.name}`);
                await uploadBytes(imageRef, fileImage);
                const url = await getDownloadURL(imageRef);
                if (url) {
                    newProduct = { ...values, image: url };
                } else {
                    message.error('Upload Image Failed!');
                    return;
                }
            } else {
                newProduct = { ...values, image: productUpdate.image };
            }
            try {
                const result = await publicAxios.put(`/api/v1/products/${productUpdate.productId}`, newProduct);     
                if (result.status === 200) {
                    message.success(result.data.message);
                    form.resetFields();
                    setFileImage(undefined);
                    await getProducts();
                } else {
                    message.error('Sửa thất bại');
                }
            } catch (error) {
                console.error(error);
                message.error('Đã có lỗi xảy ra');
            }
            return;
        }

        if (fileImage) {
            const imageRef = ref(storage, `image/${fileImage.name}`);
            await uploadBytes(imageRef, fileImage);
            const url = await getDownloadURL(imageRef);
            if (url) {
                const newProduct = { ...values, image: url };
                try {
                    const result = await publicAxios.post("/api/v1/products", newProduct);
                    if (result.status === 201) {
                        message.success(result.data.message);
                        form.resetFields();
                        setFileImage(undefined);
                        await getProducts();
                    } else {
                        message.error('Thêm mới thất bại');
                    }
                } catch (error) {
                    console.error(error);
                    message.error('Đã có lỗi xảy ra');
                }
            } else {
                message.error('Upload Image Failed!');
            }
        } else {
            message.error("Chọn ảnh");
        }
    };

    const handleOkeDelete = async (id: number) => {
        try {
            const result = await publicAxios.delete(`/api/v1/products/${id}`);
            if (result.status === 200) {
                message.success(result.data.message);
                getProducts();
            } else {
                message.error(result.data.message);
            }
        } catch (error) {
            console.error(error);
            message.error('Đã có lỗi xảy ra');
        }
    };

    const handleClickEdit = (product: Product) => {
        form.setFieldsValue({ ...product });
        setProductUpdate(product);
        setIsModalOpen(true);
    };

    const handleClickSearch = async (value: string) => {
        try {
            const result = await publicAxios.get(`/api/v1/products/search?nameProduct=${value}`);
            setProducts(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => <Image src={image} alt="img" width={100} />
        },
        {
            title: 'Tên',
            dataIndex: 'nameProduct',
            key: 'nameProduct',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <>{ formatCurrency(+price)} </>
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Tính năng',
            key: 'action',
            render: (_: any, product: Product) => (
                <>
                    <Button onClick={() => handleClickEdit(product)}>Edit</Button>
                    <Popconfirm
                        title="Delete product"
                        description="Are you sure to delete this task?"
                        onConfirm={() => handleOkeDelete(product.productId)}
                        onCancel={() => { }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <>
            <Modal
                maskClosable={false}
                width={800}
                title="Info Product"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={<></>}
            >
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    style={{ maxWidth: 800 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="category"
                        name="categoryId"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select
                            defaultValue={"Chọn Category"}
                            style={{ width: 220 }}
                            onChange={(value) => handleChangeCategory(value)}
                            options={categories.map((item) => ({ value: item.categoryId, label: item.nameCategory }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label="nameProduct"
                        name="nameProduct"
                        rules={[{ required: true, message: 'Please input product name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="price"
                        name="price"
                        rules={[{ required: true, message: 'Please input product price!' }]}
                    >
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item
                        label="stock"
                        name="stock"
                        rules={[{ required: true, message: 'Please input product stock!' }]}
                    >
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item
                        label="description"
                        name="description"
                        rules={[{ required: true, message: 'Please input product description!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="image" name="image" htmlFor='file-image'>
                        <Input id='file-image' type='file' style={{ display: "none" }} onChange={handleChangeImage} />
                        <Image src={productUpdate?.productId ? productUpdate.image : fileImage ? URL.createObjectURL(fileImage) : ""} alt='image' width={100} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
                        <Button className='bg-blue-600' type="primary" htmlType="submit">{productUpdate? "Edit": "Add"}</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title" style={{ fontSize: 50 }}>Quản lí sản phẩm</h4>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                        <div>
                            <Button  style={{ minWidth: 100 }} onClick={showModal}>Add</Button>
                        </div>
                        <div>
                            <Space direction="vertical">
                                <Input.Search
                                    placeholder="input search text"
                                    allowClear
                                    size="large"
                                    onSearch={handleClickSearch}
                                />
                            </Space>
                        </div>
                    </div>
                    <Table style={{ marginBottom: "20px" }} dataSource={products} columns={columns} />
                </div>
            </div>
        </>
    );
}

