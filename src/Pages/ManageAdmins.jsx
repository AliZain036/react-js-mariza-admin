/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {
  message,
  Input,
  Table,
  Tabs,
  Button,
  Card,
  BackTop,
  Modal,
  Form,
} from 'antd'
import { backToTop } from './styles/styles'

const { TabPane } = Tabs
const { Item } = Form

const ManageAdmins = () => {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [isLoading, setIsLoading] = useState(true)
  const [allUsers, setAllUsers] = useState(null)
  const [search, setSearch] = useState(allUsers)
  const [show, setShow] = useState(false)
  const [key, setKey] = useState('1')
  const [btnUpload, setBtnUpload] = useState(false)
  const [edit, setEdit] = useState(null)
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Email Verified',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      render: (emailVerified) => (
        <p>{emailVerified ? 'Verified' : 'Not-Verified'}</p>
      ),
    },
    {
      title: 'Disabled',
      dataIndex: 'disabled',
      key: 'disabled',
      render: (disabled) => <p>{disabled ? 'Disabled' : 'Not-Disabled'}</p>,
    },
    {
      title: 'Last Sign-in',
      dataIndex: ['metadata', 'lastSignInTime'],
      key: 'lastSignInTime',
      render: (lastSignInTime) => (
        <p>
          {new Date(lastSignInTime).toLocaleDateString()} -{' '}
          {new Date(lastSignInTime).toLocaleTimeString()}
        </p>
      ),
    },
    {
      title: 'Edit',
      dataIndex: 'uid',
      key: 'uid',
      render: (uid, item) => (
        <Button
          onClick={() => handleEdit(item)}
          className="btnSecondary"
          type="primary"
        >
          <i className="fa fa-edit"></i>
        </Button>
      ),
    },
  ]

  useEffect(() => {
    getAllUsers()
  }, [])

  const getAllUsers = async () => {
    const res = await fetch(
      'https://us-central1-locas-8d22b.cloudfunctions.net/getUsers',
    )
    if (res.status === 200) {
      const data = await res.json()
      setAllUsers(data)
      setSearch(data)
    } else {
      message.error('Error')
    }
    setIsLoading(false)
  }

  // search function
  const handleSearch = (value) => {
    value = value.trim().toLowerCase()
    let arr = allUsers
    arr = arr.filter((item) => item.email.toLowerCase().includes(value))
    setSearch(arr)
  }

  // edit user
  const handleEdit = (user) => {
    setKey('2')
    setEdit(user)
    Object.entries(user).map(([key, value]) => {
      editForm.setFieldsValue({
        [key]: value,
      })
    })
  }
  // modal close
  const handleModalClose = () => {
    setShow(false)
    form.resetFields()
    setBtnUpload(false)
  }
  // add new user
  const handleSubmit = async (values) => {
    if (values.password.length < 6) {
      message.error('Password must be at least  6 characters!')
      return
    }
    setBtnUpload(true)
    const res = await fetch(
      'https://us-central1-locas-8d22b.cloudfunctions.net/addUser',
      {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (res.status === 200) {
      let arr = allUsers
      const user = await res.json()
      arr.push(user)
      setAllUsers(arr)
      setSearch(arr)
      handleModalClose()
      message.success('User Created!')
    } else if (res.status === 400) {
      message.error('User with this email already exists!')
    } else {
      message.error('Error creating user.')
    }
    setBtnUpload(false)
  }
  // edit user details
  const handleEditSubmit = async (values) => {
    if (values.password.length < 6) {
      message.error('Password must be at least  6 characters!')
      return
    }
    setBtnUpload(true)
    values.uid = edit.uid
    const res = await fetch(
      'https://us-central1-locas-8d22b.cloudfunctions.net/editUser',
      {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (res.status === 200) {
      const data = await res.json()
      let arr = allUsers.map((item) => {
        if (item.uid === edit.uid) {
          return data
        }
        return item
      })
      setAllUsers(arr)
      setSearch(arr)
      message.success('User Updated!')
    } else {
      message.error('Error updating user!')
    }
    handleBack()
    setBtnUpload(false)
  }
  // go back to lis user
  const handleBack = () => {
    setKey('1')
    setEdit(null)
    editForm.resetFields()
  }

  return (
    <>
      <Container>
        <Tabs animated activeKey={key}>
          <TabPane key="1">
            <Row>
              <Col className="mb-2">
                <Button
                  type="primary"
                  className="btnPrimary"
                  onClick={() => setShow(true)}
                >
                  <i className="fas fa-plus"></i>
                  Add User
                </Button>
              </Col>
            </Row>
            <Row className="mb-2 d-flex justify-content-end">
              <Col xs={4}>
                <Input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Table
                  dataSource={search}
                  columns={columns}
                  loading={isLoading}
                  pagination={{
                    position: ['bottomCenter'],
                    showSizeChanger: true,
                  }}
                  scroll={{ x: true }}
                  bordered
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane key="2">
            <Card>
              <Row className="mb-2">
                <Col>
                  <Button
                    onClick={handleBack}
                    className="btnSecondary"
                    type="primary"
                  >
                    <i className="fa fa-arrow-left"> </i>Back
                  </Button>
                </Col>
              </Row>
              {edit && (
                <Form
                  form={editForm}
                  onFinish={handleEditSubmit}
                  size="large"
                  layout="vertical"
                >
                  <Row>
                    <Col md={6}>
                      <Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please enter email.' },
                        ]}
                        className="fw-bold"
                      >
                        <Input type="email" placeholder="email" />
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Item
                        name="password"
                        label="Password"
                        rules={[
                          { required: true, message: 'Please enter password.' },
                        ]}
                        className="fw-bold"
                      >
                        <Input.Password placeholder="password" />
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="d-flex justify-content-end">
                      <Button
                        loading={btnUpload}
                        htmlType="submit"
                        type="primary"
                        className="btnPrimary w-25"
                      >
                        Post
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </Container>
      <Modal
        title="New User"
        visible={show}
        footer={false}
        onCancel={handleModalClose}
        className="rounded-2"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          size="large"
          layout="vertical"
        >
          <Row>
            <Col>
              <Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please enter email.' }]}
                className="fw-bold"
              >
                <Input type="email" placeholder="email" />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter password.' }]}
                className="fw-bold"
              >
                <Input.Password placeholder="password" />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button
                loading={btnUpload}
                htmlType="submit"
                type="primary"
                className="btnPrimary w-25"
              >
                Post
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <BackTop>
        <div style={backToTop}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </BackTop>
    </>
  )
}

export default ManageAdmins
