import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';

import { publicAxios } from '../../config/publicAxios';

interface Category {
  categoryId: number;
  nameCategory: string;
}

const renderColumns = (handleOkeDelete: (id: number) => void, handleClickEdit: (category: Category) => void) => [
  {
    title: 'ID',
    dataIndex: 'categoryId',
    key: 'categoryId',
  },
  {
    title: 'Loại Sản Phẩm',
    dataIndex: 'nameCategory',
    key: 'nameCategory',
  },

  {
    title: 'Chức năng',
    key: 'action',
    render: (_:any, category: Category) => (
      <>
        <Button onClick={() => handleClickEdit(category)}>Edit</Button>
        <Popconfirm
          title="Delete category"
          description="Are you sure to delete this task?"
          onConfirm={() => handleOkeDelete(category.categoryId)}
          onCancel={() => { }}
          okText ="Yes"
          cancelText="No"
        >
          <Button style={{ marginLeft: 10 }} danger>Delete</Button>
        </Popconfirm>
      </>
    ),
  },
];

export default function AdminCategory() {
  const [category, setCategory] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryUpdate, setCategoryUpdate] = useState<Category | undefined>();
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
    setCategoryUpdate(undefined);
  };

  const onFinish = async (values: any) => {
    const check = category.find(item => item.nameCategory === values.nameCategory);
    if (check) {
      message.error('Tên sản phẩm đã tồn tại');
    } else {
      if (categoryUpdate) {
        try {
          const result = await publicAxios.put(`/api/v1/categories/${categoryUpdate.categoryId}`, values);
          if (result.status === 201) {
            message.success(result.data.message);
             getCategories();
          }
        } catch (error) {
          console.log(error);
          message.error('Đã có lỗi xảy ra');
        }
      } else {
        try {
          const result = await publicAxios.post("/api/v1/categories", values);
          if (result.status === 201) {
            message.success(result.data.message);
            await getCategories();
          }
        } catch (error) {
          console.log(error);
          message.error('Đã có lỗi xảy ra');
        }
      }
      handleCancel();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const getCategories = async () => {
    try {
      const res = await publicAxios.get("/api/v1/categories");
      setCategory(res.data);
    } catch (error) {
      console.log(error);
      message.error('Đã có lỗi xảy ra');
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleOkeDelete = async (id: number) => {
    try {
      const result = await publicAxios.delete(`/api/v1/categories/${id}`);
      if (result.status == 201) {
        message.success(result.data.message);
        await getCategories();
      } else {
        message.error("Xoá thất bại");
      }
    } catch (error) {
      console.log(error);
      message.error('Đã có lỗi xảy ra');
    }
  };

  const handleClickEdit = (category: Category) => {
    form.setFieldsValue({ ...category });
    setCategoryUpdate(category);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Modal
        maskClosable={false}
        width={800}
        title="Info Product"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Thêm Loại Sản Phẩm"
            name="nameCategory"
            rules={[{ required: true, message: 'Please input your category!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5 }}>
            <Button className='bg-blue-700' type="primary" htmlType="submit">{categoryUpdate ? "Edit" : "Add"}</Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="col-12">
        <div className="page-title-box">
          <h4 className="page-title" style={{ fontSize: 50 }}>Phân Loại Sản Phẩm</h4>
        </div>
        <div>
          <Button style={{ minWidth: 100 }} onClick={showModal}>Add</Button>
        </div>
      </div>
      <Table dataSource={category} columns={renderColumns(handleOkeDelete, handleClickEdit)} />
    </div>
  );
}
