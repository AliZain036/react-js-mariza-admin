/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Tabs,
  message,
  Form,
  Input,
  Card,
  BackTop,
  Modal,
  Tag,
  Tooltip,
  notification,
} from 'antd'
import { Container, Row, Col } from 'react-bootstrap'
import { firebase } from '../Firebase/config'
import { backToTop } from './styles/styles'
import { cloneDeep } from 'lodash'
import { fetchUsers } from '../Redux/Actions/users'
import { useDispatch } from 'react-redux'
import ViewWIshlist from '../Components/View Wishlist/ViewWIshlist'
import ViewProducts from '../Components/View Products/ViewProducts'
import {
  FacebookFilled,
  FacebookOutlined,
  GoogleSquareFilled,
} from '@ant-design/icons'

const { TabPane } = Tabs
const { Item } = Form

const Users = () => {
  //state
  const [viewWishlist, setViewWishlist] = useState(null)
  const [viewProducts, setViewProducts] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState(allUsers)
  const [show, setShow] = useState(false)
  const [key, setKey] = useState('1')
  const [edit, setEdit] = useState(null)
  const [form] = Form.useForm()
  const [newForm] = Form.useForm()
  const [btnUpload, setBtnUpload] = useState(false)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span>...{id.substr(id.length - 5)}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, item) => (
        <>
          {console.log(item?.image, 'item.image')}
          <span>
            {item?.image?.includes('graph.facebook.com') ? (
              <>
                <FacebookFilled style={{ color: '#4267B2' }} />
              </>
            ) : item?.image?.includes('lh3.googleusercontent.com') ? (
              <>
                <GoogleSquareFilled style={{ color: '#BB001B' }} />
              </>
            ) : null}{' '}
            {name}{' '}
          </span>
        </>
        // lh3.googleusercontent.com
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Wishlist',
      dataIndex: 'wishlist',
      key: 'wishlist',
      render: (wishlist, item) => (
        <Tooltip title="View Wishlist (Private/Public)">
          <Button onClick={() => handleViewWishlist(wishlist, item.id)}>
            <i className="fa fa-eye" />
          </Button>
        </Tooltip>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'id',
      key: 'products-id',
      render: (id) => (
        <Tooltip title="View added products">
          <Button onClick={() => handleViewProducts(id)}>
            <i className="fa fa-eye" />
          </Button>
        </Tooltip>
      ),
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified, item) => (
        <Tooltip
          title={!verified ? 'Click to verify user' : 'Click unverify user'}
        >
          {verified ? (
            <span
              onClick={() => handleUnVerify(item.id)}
              className="text-success"
              style={{ cursor: 'pointer' }}
            >
              Verified
            </span>
          ) : (
            <span
              onClick={() => handleVerify(item.id)}
              style={{ cursor: 'pointer' }}
              className="text-danger"
            >
              Unverified
            </span>
          )}
        </Tooltip>
      ),
    },
    {
      title: 'Block',
      dataIndex: 'block',
      render: (block, item) => {
        return block ? (
          <Col>
            <Button
              className="btnWarning"
              onClick={() => handleUnblock(item)}
              type="primary"
              loading={isLoading}
            >
              Unblock
            </Button>
          </Col>
        ) : (
          <Col>
            <Button
              className="btnDanger"
              onClick={() => handleBlock(item)}
              type="primary"
              loading={isLoading}
            >
              Block
            </Button>
          </Col>
        )
      },
    },
    {
      title: 'Edit',
      dataIndex: 'id',
      key: 'id',
      render: (id, item) => (
        <Button
          type="primary"
          className="btnSecondary"
          onClick={() => handleEdit(item)}
        >
          <i className="fa fa-edit"></i>
        </Button>
      ),
    },
  ]
  // redux
  const dispatch = useDispatch()

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    // dispatch(fetchUsers());
    try {
      await firebase
        .firestore()
        .collection('users')
        .get()
        .then((docs) => {
          let arr = []
          docs.forEach((doc) => {
            let obj = {
              id: doc.id,
              ...doc.data(),
            }
            arr.push(obj)
          })
          setAllUsers(arr)
          setSearch(arr)
          setIsLoading(false)
        })
    } catch (error) {
      console.log(error.message)
    }
  }

  // block user
  const handleBlock = async (user) => {
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('users')
      .doc(user.id)
      .set({ block: true }, { merge: true })
      .then(() => {
        let arr = cloneDeep(allUsers)
        arr = arr.map((item) => {
          if (item.id === user.id) {
            item = {
              ...item,
              block: true,
            }
          }
          return item
        })
        setAllUsers(arr)
        setSearch(arr)
        message.success(user.name + ' blocked!')
        dispatch(fetchUsers())
      })
    setIsLoading(false)
  }
  // unblock user
  const handleUnblock = async (user) => {
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('users')
      .doc(user.id)
      .set({ block: false }, { merge: true })
      .then(() => {
        let arr = cloneDeep(allUsers)
        arr = arr.map((item) => {
          if (item.id === user.id) {
            item = {
              ...item,
              block: false,
            }
          }
          return item
        })
        setAllUsers(arr)
        setSearch(arr)
        message.success(user.name + ' unblocked!')
        dispatch(fetchUsers())
      })
    setIsLoading(false)
  }

  // search function
  const handleSearch = (value) => {
    value = value.trim().toLowerCase()
    let arr = cloneDeep(allUsers)
    arr = arr.filter(
      (item) =>
        item?.name?.toLowerCase().includes(value) ||
        item?.email?.toLowerCase().includes(value),
    )
    setSearch(arr)
  }

  // edit user
  const handleEdit = (user) => {
    setKey('2')
    setEdit(user)
    Object.entries(user).map(([key, value]) => {
      form.setFieldsValue({
        [key]: value,
      })
    })
  }

  // go back to list of users
  const handleBack = () => {
    setKey('1')
    setEdit(null)
    setViewWishlist(null)
    setViewProducts(null)
    form.resetFields()
  }
  // edit submit form
  const handleEditSubmit = async (values) => {
    setBtnUpload(true)
    console.log(values)
    await firebase
      .firestore()
      .collection('users')
      .doc(edit.id)
      .set(values, { merge: true })
      .then(() => {
        message.success(edit.name + ' Updated!')
        handleBack()
        getUsers()
      })
      .catch((e) => console.log(e))
    setBtnUpload(false)
  }

  // verify user
  const handleVerify = async (id) => {
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('users')
      .doc(id)
      .set({ verified: true }, { merge: true })
      .then(async (doc) => {
        await getUsers()
        notification.success({ message: 'User verified.' })
      })
      .catch((err) => console.log(err))
    setIsLoading(false)
  }

  const handleUnVerify = async (id) => {
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('users')
      .doc(id)
      .set({ verified: false }, { merge: true })
      .then(async (doc) => {
        await getUsers()
        notification.success({ message: 'User verified.' })
      })
      .catch((err) => console.log(err))
    setIsLoading(false)
  }

  // add new user
  const handleSubmit = async (values) => {
    values.block = false // default status of user
    values.verified = false // initially verified
    values.wishlist = [] // wishlist empty when new user is created
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('users')
      .add(values)
      .then(() => {
        message.success('User Created!')
        dispatch(fetchUsers())
        getUsers()
        newForm.resetFields()
        setShow(false)
      })
      .catch((error) => {
        message.error('Error Creating User!')
      })
    setIsLoading(false)
  }

  // view wishlist
  const handleViewWishlist = (wishlist, id) => {
    setViewWishlist({
      wishlist,
      id,
    })
    setKey('3')
  }

  // view products
  const handleViewProducts = (id) => {
    setViewProducts(id)
    setKey('4')
  }

  return (
    <>
      <Container>
        <Tabs animated activeKey={key}>
          <TabPane key="1">
            <Row>
              <Col>
                <Button
                  size="large"
                  onClick={() => setShow(true)}
                  type="primary"
                  className="btnPrimary"
                >
                  + Add User
                </Button>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="d-flex justify-content-center">
                <Tag
                  className="my-2 rounded-pill font18 px-3 py-2"
                  color="blue"
                >
                  Total Users: {search ? search.length : 0}
                </Tag>
              </Col>
            </Row>
            <Row className="mb-2 d-flex justify-content-end">
              <Col md={4}>
                <Input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
            <Table
              bordered
              dataSource={search}
              columns={columns}
              scroll={{ x: true }}
              loading={isLoading}
              pagination={{
                position: ['bottomCenter'],
              }}
            />
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
                    <span className="me-1">
                      <i className="fa fa-arrow-left"> </i>
                    </span>
                    <span className="">Back</span>
                  </Button>
                </Col>
              </Row>
              {edit && (
                <Form
                  size="large"
                  form={form}
                  onFinish={handleEditSubmit}
                  layout="vertical"
                  className="fw-bold"
                >
                  <Row>
                    <Col md={6}>
                      <Item
                        label="Name"
                        name="name"
                        rules={[{ message: 'Required Field', required: true }]}
                      >
                        <Input type="text" />
                      </Item>
                    </Col>
                    <Col md={6}>
                      <Item
                        label="Email"
                        name="email"
                        rules={[{ message: 'Required Field', required: true }]}
                      >
                        <Input type="text" />
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Item
                        label="Contact"
                        name="contact"
                        rules={[{ message: 'Required Field', required: true }]}
                      >
                        <Input type="text" />
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-end">
                      <Button
                        loading={btnUpload}
                        type="primary"
                        htmlType="submit"
                        className="btnPrimary"
                      >
                        Update
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card>
          </TabPane>
          <TabPane key="3">
            <Card className="rounded-2">
              <Row className="mb-2">
                <Col>
                  <Button
                    onClick={handleBack}
                    className="btnSecondary"
                    type="primary"
                  >
                    <span className="me-1">
                      <i className="fa fa-arrow-left"> </i>
                    </span>
                    <span className="">Back</span>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  {viewWishlist && (
                    <ViewWIshlist
                      wishlist={viewWishlist.wishlist}
                      id={viewWishlist.id}
                    />
                  )}
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane key="4">
            <Card className="rounded-2">
              <Row className="mb-2">
                <Col>
                  <Button
                    onClick={handleBack}
                    className="btnSecondary"
                    type="primary"
                  >
                    <span className="me-1">
                      <i className="fa fa-arrow-left"> </i>
                    </span>
                    <span className="">Back</span>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>{viewProducts && <ViewProducts id={viewProducts} />}</Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </Container>
      <BackTop>
        <div style={backToTop}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </BackTop>
      <Modal
        title="Add new User"
        visible={show}
        footer={null}
        width="600px"
        onCancel={() => setShow(false)}
      >
        <Form
          size="large"
          onFinish={handleSubmit}
          layout="vertical"
          className="fw-bold"
          form={newForm}
        >
          <Row>
            <Col md={6}>
              <Item
                label="Name"
                name="name"
                rules={[{ message: 'Required Field', required: true }]}
              >
                <Input type="text" />
              </Item>
              <small className="text-info">
                By default user blocked status will be 'false'.
              </small>
            </Col>
            <Col md={6}>
              <Item
                label="Email"
                name="email"
                rules={[{ message: 'Required Field', required: true }]}
              >
                <Input type="text" />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Item
                label="Contact"
                name="contact"
                rules={[{ message: 'Required Field', required: true }]}
              >
                <Input type="text" />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="btnPrimary"
              >
                Add User
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default Users
