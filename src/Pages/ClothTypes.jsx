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
  Popconfirm,
} from 'antd'
import { firebase } from '../Firebase/config'
import { cloneDeep, some } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../Redux/Actions/categories'
import { addDoc, deleteDoc, getData, updateDoc } from '../Firebase/utils'

const { Item } = Form
const { TabPane } = Tabs
const { Option } = Select

const ClothTypes = () => {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [allCateg, setAllCateg] = useState([])
  const [search, setSearch] = useState([])
  const [clothTypes, setClothTypes] = useState([])
  const [clothTypesDetails, setClothTypesDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [btnUpload, setBtnUpload] = useState('')
  const [edit, setEdit] = useState(null)
  const [key, setKey] = useState('1')
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (id, item) => (
        <div className="d-flex">
          <Button
            onClick={() => {
              editForm.setFieldsValue({ name: item?.name, id: id })
              console.log(editForm.getFieldValue('name'))
              setClothTypesDetails({ id: id, ...item })
              setShow(true)
            }}
            className="btnSecondary me-2"
            type="primary"
            // loading={btnUpload === id}
          >
            <i className="fa fa-edit"></i>
          </Button>
          <Popconfirm
            title="Delete cloth type?"
            description="Are you sure to delete this cloth type?"
            placement="topLeft"
            onConfirm={() => handleDelete(id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="btnDanger"
              type="primary"
              // loading={btnUpload === id}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  console.log(clothTypesDetails)

  useEffect(() => {
    getAllClothTypes()
  }, [])

  const getAllClothTypes = async () => {
    setIsLoading(true)
    let data = await getData('clothTypes')
    setIsLoading(false)
    if (data) {
      setClothTypes(data)
    }
  }

  const handleAddClothType = async (values) => {
    editForm.resetFields()
    setBtnUpload(true)
    setIsLoading(true)
    let response = await addDoc('clothTypes', { name: values?.name })
    if (response === true) {
      handleModalClose()
      getAllClothTypes()
      form.resetFields()
      message.success('Cloth Type Created!')
    } else {
      message.error('Error Creating Cloth Type!')
    }
    setBtnUpload(false)
    setIsLoading(false)
  }

  const handleModalClose = () => {
    setShow(false)
    form.resetFields()
  }

  const handleEditCategory = async (values) => {
    console.log(editForm.getFieldsValue())
    editForm.resetFields()
    setBtnUpload(true)
    setIsLoading(true)
    let response = await updateDoc('clothTypes', clothTypesDetails.id, {
      name: values?.name,
    })
    if (response === true) {
      handleModalClose()
      getAllClothTypes()
      editForm.resetFields()
      message.success('Cloth Type Updated!')
    } else {
      message.error('Error Creating Cloth Type!')
    }
    setBtnUpload(false)
    setIsLoading(false)
  }

  const handleDelete = async (id) => {
    setIsLoading(true)
    let response = await deleteDoc('clothTypes', id)
    setIsLoading(false)
    if (response) {
      message.success('Cloth Type Deleted!')
      getAllClothTypes()
    }
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
                  onClick={() => setShow(true)}
                  className="btnPrimary"
                  type="primary"
                  size="large"
                >
                  + Add Cloth Type
                </Button>
              </Col>
            </Row>
            {/* <Row className="mb-2">
              <Col className="d-flex justify-content-center">
                <Tag
                  className="my-2 rounded-pill font18 px-3 py-2"
                  color="blue"
                >
                  Total Categories: {search ? search.length : 0}
                </Tag>
              </Col>
            </Row> */}
            <Row className="mb-2 d-flex justify-content-end">
              <Col md={4}>
                <Select
                  allowClear
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Search cloth types"
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
                  {clothTypes.map((item) => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table
                  bordered
                  dataSource={clothTypes}
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
                      <h4 className="text-center">Edit {edit.name}</h4>
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
        title={`${
          editForm.getFieldValue('name') ? 'Edit' : 'Add'
        } New Cloth Type`}
        visible={show}
        footer={false}
        onCancel={handleModalClose}
      >
        {editForm.getFieldValue('name') ? (
          <Form
            layout="vertical"
            onFinish={handleEditCategory}
            form={editForm}
            size="large"
          >
            <Row>
              <Col>
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
        ) : (
          <Form
            layout="vertical"
            onFinish={handleAddClothType}
            form={form}
            size="large"
          >
            <Row>
              <Col>
                <Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter title!' }]}
                  className="fw-bold"
                >
                  <Input type="text" />
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
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </>
  )
}

export default ClothTypes
