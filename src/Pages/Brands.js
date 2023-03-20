import {
  DeleteFilled,
  EditFilled,
  InboxOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Upload,
} from 'antd'
import Item from 'antd/lib/list/Item'
import { Option } from 'antd/lib/mentions'
import Dragger from 'antd/lib/upload/Dragger'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import {
  addDoc,
  deleteDoc,
  getData,
  singleImageUpload,
  updateDoc,
} from '../Firebase/utils'

const Brands = () => {
  const [brandDetails, setBrandDetails] = useState(null)
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [colors, setColors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false)
  const [isUpdateBrandModalOpen, setIsUpdateBrandModalOpen] = useState(false)
  const [addBrandForm] = Form.useForm()
  const [updateBrandForm] = Form.useForm()
  const [fileName, setFileName] = useState('')
  const [actionBtnId, setActionBtnId] = useState('')
  let brandsTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Primary Image',
      dataIndex: 'primary_image',
      key: 'primary_image',
      render: (url) => (
        <div className="d-flex flex-wrap">
          <Avatar size={65} shape="square" src={<Image src={url} />} />
        </div>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      render: (id, item) => (
        <Space wrap>
          <Button
            loading={actionBtnId === id}
            onClick={() => {
              updateBrandForm.setFieldsValue({
                name: item.name,
                // products: [item.products],
                products: [...item.products?.map((prod) => prod.id)],
                primary_image: item.primary_image,
                popularBrand: item.is_popular_brand,
              })
              console.log(updateBrandForm.getFieldValue('products'))
              setBrandDetails({ id: id, ...item })
              setIsUpdateBrandModalOpen(true)
            }}
            className="btnSecondary text-white"
          >
            <EditFilled />
          </Button>
          <Popconfirm
            title="Delete brand?"
            description="Are you sure to delete this brand?"
            placement="topLeft"
            onConfirm={() => handleDeleteBrand(id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
          <Button
            // loading={actionBtnId === id}
            className="btnDanger text-white"
          >
            <DeleteFilled />
          </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  const brandProducts = []
  useEffect(() => {
    getAllBrands()
    getAllColors()
    getAllProducts()
  }, [])

  const handleDeleteBrand = async (id) => {
    setIsLoading(true)
    let response = await deleteDoc('brands', id)
    if (response === true) {
      setIsLoading(false)
      getAllBrands()
    }
    console.log(response)
  }

  const getAllBrands = async () => {
    setIsLoading(true)
    let data = await getData('brands')
    setIsLoading(false)
    if (data) {
      console.log(data)
      setBrands(data)
    }
  }

  const getAllColors = async () => {
    let data = await getData('colors')
    if (data) {
      setColors(data)
    }
  }

  const getAllProducts = async () => {
    let data = await getData('products')
    if (data) {
      setProducts(data)
    }
  }

  const handleAddBrand = async (values) => {
    setBrandDetails(null)
    setIsLoading(true)
    let brand_primary_image_url = await singleImageUpload(
      'brand-images',
      values.primary_image.file.originFileObj,
    )
    const body = {
      name: values.name,
      products: values?.products,
      primary_image: brand_primary_image_url,
      is_popular_brand: values.popularBrand,
    }
    let response = await addDoc('brands', body)
    if (response === true) {
      getAllBrands()
    }
    setIsLoading(false)
    setIsAddBrandModalOpen(false)
  }

  const handleUpdateBrand = async (values) => {
    setIsLoading(true)
    let brand_primary_image_url
    if (typeof values.primary_image !== 'string') {
      brand_primary_image_url = await singleImageUpload(
        'brand-images',
        values.primary_image.file.originFileObj,
      )
    }
    const updateBrandProducts = updateBrandForm.getFieldValue('products')
    let prod = products?.filter(
      (prod) =>
        prod.id === updateBrandProducts?.find((item) => item === prod.id),
    )
    let body = {
      name: updateBrandForm.getFieldValue('name'),
      products: prod,
      primary_image: brand_primary_image_url
        ? brand_primary_image_url
        : brandDetails?.primary_image,
      is_popular_brand: updateBrandForm.getFieldValue('popularBrand'),
    }
    let result = await updateDoc('brands', brandDetails.id, body)
    if (result === true) {
      message.success('Brand Updated Successfully!')
      getAllBrands()
    }
    setIsLoading(false)
    setIsUpdateBrandModalOpen(false)
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  return (
    <Container>
      <div className="mt-5">
        <div className="d-flex align-items-center mb-3 my-2">
          <h5 className="m-0">Brands List</h5>
          <Button
            onClick={() => setIsAddBrandModalOpen(true)}
            className="btnPrimary text-white ms-3 cursor-pointer"
          >
            Add New Brand
          </Button>
        </div>
        <Table
          bordered
          dataSource={brands}
          columns={brandsTableColumns}
          scroll={{ x: true }}
          loading={isLoading}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
          }}
          //   rowKey={(item) => item.id}
          //   expandable={{
          //     expandedRowRender: (item) => {
          //       return (
          //         <div>
          //           <Row>
          //             <Col>
          //               <Space direction="vertical" wrap>
          //                 <strong>Product ID</strong>
          //                 <p>{item?.id ?? ''}</p>
          //                 <strong>Description:</strong>
          //                 <p style={{ margin: 0, textAlign: 'justify' }}>
          //                   {item.description}
          //                 </p>
          //               </Space>
          //             </Col>
          //           </Row>
          //         </div>
          //       )
          //     },
          //   }}
        />
      </div>
      <Modal
        title="Add Brand"
        visible={isAddBrandModalOpen}
        onCancel={() => setIsAddBrandModalOpen(false)}
        footer={null}
      >
        <Form
          size="large"
          onFinish={handleAddBrand}
          layout="vertical"
          className="fw-bold w-100"
          form={addBrandForm}
        >
          <div className="row">
            <div className="col-6">
              <Form.Item
                name={'name'}
                rules={[
                  { required: 'true', message: 'Brand name is required!' },
                ]}
                label="Name"
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item
                name={'products'}
                rules={[{ required: 'true', message: 'Please add products!' }]}
                label="Products"
                // initialValue={brandDetails?.products ?? []}
              >
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Select Products"
                >
                  {products &&
                    products?.map((item) => {
                      return (
                        <Select.Option value={item.id}>
                          {item.name}
                        </Select.Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item
                label="Popular Brand"
                name={'popularBrand'}
                rules={[{ required: true, message: 'This is required!' }]}
                className="fw-bold"
              >
                <Select placeholder="Add to Popular Brands">
                  <Select.Option value={'yes'}>Yes</Select.Option>
                  <Select.Option value={'no'}>No</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item
                name={'primary_image'}
                rules={[
                  {
                    required: 'true',
                    message: 'Please add brand primary image!',
                  },
                ]}
                label="Primary Image"
              >
                <Dragger
                  maxCount={1}
                  // multiple={false}
                  customRequest={dummyRequest}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">Select single image</p>
                </Dragger>
              </Form.Item>
            </div>
          </div>
          <div>
            <Button
              // onClick={handleAddNewBrand}
              htmlType="submit"
              loading={isLoading}
              className="btnPrimary text-white cursor-pointer"
              style={{ marginLeft: 'auto' }}
            >
              Add
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Edit Brand"
        visible={isUpdateBrandModalOpen}
        onCancel={() => setIsUpdateBrandModalOpen(false)}
        footer={null}
      >
        <Form
          size="large"
          onFinish={handleUpdateBrand}
          layout="vertical"
          className="fw-bold w-100"
          form={updateBrandForm}
          initialValues={{
            products: brandDetails?.products ?? [],
          }}
        >
          <div className="row">
            <div className="col-6">
              <Form.Item
                name={'name'}
                rules={[
                  { required: 'true', message: 'Brand name is required!' },
                ]}
                label="Name"
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item
                name={'products'}
                rules={[{ required: 'true', message: 'Please add products!' }]}
                label="Products"
              >
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Select Products"
                  onSelect={(prodId) => {
                    const prod = products.find((p) => p.id === prodId)
                    brandProducts.push(prod)
                  }}
                  // value={}
                >
                  {products &&
                    products?.map((item) => {
                      return (
                        <Select.Option value={item.id}>
                          {item.name}
                        </Select.Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item
                label="Popular Brand"
                name={'popularBrand'}
                rules={[{ required: true, message: 'This is required!' }]}
                className="fw-bold"
                initialValue={updateBrandForm.getFieldValue('popularBrand')}
              >
                <Select placeholder="Add to Popular Brands">
                  <Select.Option value={'yes'}>Yes</Select.Option>
                  <Select.Option value={'no'}>No</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          {brandDetails?.primary_image && (
            <Row>
              <Col>
                <h6>
                  Previous Image{' '}
                  <Tooltip title="Click to Remove Image">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </h6>
                <Space wrap>
                  <Avatar
                    // onClick={() => handleRemoveImage(idx)}
                    size={80}
                    style={{ cursor: 'pointer' }}
                    className="me-2"
                    shape="square"
                    src={
                      <Image src={brandDetails?.primary_image} preview={true} />
                    }
                  />
                  {/* {edit.images.map((it, idx) => (
                  ))} */}
                </Space>
              </Col>
            </Row>
          )}
          <div className="row">
            <div className="col-12">
              <Form.Item
                name={'primary_image'}
                // rules={[
                //   {
                //     required: 'true',
                //     message: 'Please add brand primary image!',
                //   },
                // ]}
                label="Primary Image"
              >
                <Dragger
                  maxCount={1}
                  // multiple={false}
                  customRequest={dummyRequest}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Select single or multiple images
                  </p>
                </Dragger>
              </Form.Item>
            </div>
          </div>
          <div>
            <Button
              // onClick={handleAddNewBrand}
              htmlType="submit"
              loading={isLoading}
              className="btnPrimary text-white cursor-pointer"
              style={{ marginLeft: 'auto' }}
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </Container>
  )
}

export default Brands
