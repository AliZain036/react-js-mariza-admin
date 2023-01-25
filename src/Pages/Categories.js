/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Tabs,
  Select,
  Card,
  Avatar,
  Image,
} from 'antd'
import { firebase } from '../Firebase/config'
import { cloneDeep, some } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../Redux/Actions/categories'
import { addDoc, singleImageUpload } from '../Firebase/utils'
import Dragger from 'antd/lib/upload/Dragger'
import { InboxOutlined } from '@ant-design/icons'

const { Item } = Form
const { TabPane } = Tabs
const { Option } = Select

const Categories = () => {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [allCateg, setAllCateg] = useState([])
  const [categoryDetails, setCategoryDetails] = useState(null)
  const [search, setSearch] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [btnUpload, setBtnUpload] = useState('')
  const [edit, setEdit] = useState(null)
  const [key, setKey] = useState('1')
  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (id) => <span>...{id.substr(id.length - 5)}</span>,
    // },
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
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (id, item) => (
        <div className="d-flex">
          <Button
            onClick={() => {
              setCategoryDetails({ id: id, ...item })
              editForm.setFieldsValue({ name: item.name })
              handleEdit(id, item)
            }}
            className="btnSecondary me-2"
            type="primary"
            // loading={btnUpload === id}
          >
            <i className="fa fa-edit"></i>
          </Button>
          <Button
            onClick={() => handleDelete(id)}
            className="btnDanger"
            type="primary"
            // loading={btnUpload === id}
          >
            <i className="fa fa-trash"></i>
          </Button>
        </div>
      ),
    },
  ]

  // redux
  const dispatch = useDispatch()
  const categoriesRedux = useSelector((state) => state.categories)

  useEffect(() => {
    if (categoriesRedux.isLoading) {
      getCategories()
    }
    setAllCateg(categoriesRedux.categories)
    setSearch(categoriesRedux.categories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesRedux])

  const getCategories = async () => {
    // categories
    setIsLoading(true)
    await dispatch(fetchCategories())
    setIsLoading(false)
  }

  const handleAddCategory = async (values) => {
    // setBrandDetails(null)
    form.resetFields()
    setIsLoading(true)
    setBtnUpload(true)
    let brand_primary_image_url = await singleImageUpload(
      'category-images',
      values.primary_image.file.originFileObj,
    )
    const body = {
      name: values.name,
      primary_image: brand_primary_image_url,
    }
    let response = await addDoc('categories', body)
    setIsLoading(false)
    setBtnUpload(false)
    if (response === true) {
      getCategories()
      setShow(false)
    }
  }

  const handleModalClose = () => {
    setShow(false)
    form.resetFields()
  }

  const handleEdit = (id, item) => {
    let obj = allCateg.find((item) => item.id === id)
    setEdit(obj)
    setKey('2')
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const handleEditCategory = async (values) => {
    // setBtnUpload(edit.id)
    // if new image is added
    let data = {
      name: values.name,
    }
    setBtnUpload(true)
    let brand_primary_image_url
    if (values?.primary_image) {
      brand_primary_image_url = await singleImageUpload(
        'category-images',
        values.primary_image.file.originFileObj,
      )
      data.primary_image = brand_primary_image_url
    }
    await firebase
      .firestore()
      .collection('categories')
      .doc(categoryDetails?.id)
      .set(data, { merge: true })
      .then(() => {
        message.success(edit.name + ' Updated!')
        handleBack() // back to list
        getCategories()
      })
      .catch((e) => {
        message.error('Problem updating ' + edit.name)
        console.log(e)
      })
    setBtnUpload(false)
  }

  const handleDelete = async (id) => {
    setBtnUpload(id)
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('categories')
      .doc(id)
      .delete()
      .then(async () => {
        message.success('Category Deleted!')
        await getCategories()
      })
      .finally(() => setIsLoading(false))
    setBtnUpload('')
  }

  // back to list page (category)
  const handleBack = () => {
    setKey('1')
    setEdit(null)
  }

  const handleSearch = (value) => {
    let arr = cloneDeep(allCateg)
    arr = arr.filter((item) => item.id === value)
    setSearch(arr)
  }

  const handleClear = (value) => {
    setSearch(allCateg)
  }

  return (
    <>
      <Container>
        <Tabs activeKey={key} animated>
          <TabPane key="1">
            <Row className="mb-2">
              <Col>
                <Button
                  loading={isLoading}
                  onClick={() => setShow(true)}
                  className="btnPrimary"
                  type="primary"
                  size="large"
                >
                  + Add category
                </Button>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="d-flex justify-content-center">
                <Tag
                  className="my-2 rounded-pill font18 px-3 py-2"
                  color="blue"
                >
                  Total Categories: {search ? search.length : 0}
                </Tag>
              </Col>
            </Row>
            <Row className="mb-2 d-flex justify-content-end">
              <Col md={4}>
                <Select
                  allowClear
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Search categories"
                  // onChange={handleSearch}
                  onClear={handleClear}
                  onSelect={handleSearch}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {search.map((item) => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table
                  bordered
                  dataSource={search}
                  columns={columns}
                  pagination={{
                    position: ['bottomCenter'],
                  }}
                  scroll={{ x: true }}
                  loading={isLoading}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane key="2">
            <Card className="rounded-2">
              <Row className="mb-2">
                <Col>
                  <Button
                    onClick={handleBack}
                    className="btnSecondary"
                    type="primary"
                  >
                    <i className="fa fa-arrow-left me-1"> </i>Back
                  </Button>
                </Col>
              </Row>
              <Row>
                {edit && (
                  <Row>
                    <Col>
                      <h4 className="text-center">Edit Category</h4>
                      <Form
                        layout="vertical"
                        onFinish={handleEditCategory}
                        form={editForm}
                        size="large"
                      >
                        <Row>
                          <Col md={6}>
                            <Item
                              label="Name"
                              name="name"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter title!',
                                },
                              ]}
                              className="fw-bold"
                            >
                              <Input type="text" />
                            </Item>
                          </Col>
                          <Col md={6}>
                            <Item label="Previous Image" className="fw-bold">
                              <Avatar
                                size={65}
                                shape="square"
                                src={
                                  <Image src={categoryDetails?.primary_image} />
                                }
                              />
                            </Item>
                          </Col>
                          <Col md={12}>
                            <Item
                              label="Primary Image"
                              name="primary_image"
                              className="fw-bold"
                            >
                              <Dragger
                                customRequest={dummyRequest}
                                listType="picture"
                                maxCount={1}
                              >
                                <p className="ant-upload-drag-icon">
                                  <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                  Click or drag file to this area to upload
                                </p>
                                <p className="ant-upload-hint">
                                  Select single image
                                </p>
                              </Dragger>
                            </Item>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col className="d-flex justify-content-end">
                            <Button
                              loading={btnUpload}
                              className="btnPrimary"
                              htmlType="submit"
                              type="primary"
                            >
                              Update
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                )}
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </Container>
      <Modal
        title="Add New Category"
        visible={show}
        footer={false}
        onCancel={handleModalClose}
      >
        <Form
          layout="vertical"
          onFinish={handleAddCategory}
          form={form}
          size="large"
        >
          <Row>
            <Col md={12}>
              <Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter title!' }]}
                className="fw-bold"
              >
                <Input type="text" />
              </Item>
            </Col>
            <Col md={12}>
              <Item
                name="primary_image"
                label="Primary Image"
                tooltip="Upload single image"
                rules={[{ message: 'Required field!', required: true }]}
              >
                <Dragger
                  multiple
                  customRequest={dummyRequest}
                  listType="picture"
                  maxCount={1}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">Select single image</p>
                </Dragger>
              </Item>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button
                loading={btnUpload}
                className="btnPrimary"
                htmlType="submit"
                type="primary"
              >
                Post
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default Categories
