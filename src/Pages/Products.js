import {
  DeleteOutlined,
  PlusOutlined,
  PoundCircleFilled,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  BackTop,
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Upload,
} from 'antd'
import { cloneDeep, debounce, filter, map, some } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { firebase } from '../Firebase/config'
import {
  deleteStorageFiles,
  multiImageUpload,
  getUserByID,
  updateDoc,
  saveData,
  addDoc,
  getData,
} from '../Firebase/utils'
import { addCategory, fetchCategories } from '../Redux/Actions/categories'
import { addInterest, fetchInterests } from '../Redux/Actions/interest'
import { fetchProducts, updateProduct } from '../Redux/Actions/products'
import { backToTop } from './styles/styles'

const { Item } = Form
const { Option } = Select
const { TabPane } = Tabs

const colStyle = {
  maxHeight: '200px',
  maxWidth: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  overflowY: 'auto',
  overflowX: 'hidden',
}

const Products = () => {
  // id of admin
  const sendMailFunc = firebase.functions().httpsCallable('sendMail')
  const [fileName, setFileName] = useState('')
  const dispatch = useDispatch()
  const [discountType, setDiscountType] = useState('%')
  const [catSearch, setCatSearch] = useState('')
  const [productDetails, setProductDetails] = useState(null)
  const [colorSearch, setColorSearch] = useState('')
  const [clothTypeSearch, setClothTypeSearch] = useState('')
  const [brands, setBrands] = useState([])
  const [interSearch, setInterSearch] = useState('')
  const [recSearch, setRecSearch] = useState('')
  const user = useSelector((state) => state.user.user)
  const [allProducts, setAllProducts] = useState(null)
  const [featuredCount, setfeaturedCount] = useState(0)
  const [isLoading, setisLoading] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [IsLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState(allProducts)
  const [show, setShow] = useState(false)
  const [categ, setCateg] = useState(null)
  const [recipients, setRecipients] = useState(null)
  const [interests, setInterests] = useState(null)
  const [occasions, setOccasions] = useState(null)
  const [colors, setColors] = useState([])
  const [clothTypes, setClothTypes] = useState([])
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [btnUpload, setBtnUpload] = useState(false)
  const [key, setKey] = useState('1')
  const [edit, setEdit] = useState(null)
  const [discount, setDiscount] = useState('')
  const [discountedPrice, setDiscountedPrice] = useState(0)
  const [originalPrice, setOriginalPrice] = useState(null)
  const [beforeUpload, setBeforeUpload] = useState(null)
  const [text, setText] = React.useState('')
  const [allWishlist, setAllWishlist] = React.useState('')
  const currentdateTime = moment().format('DD-MM-YYYY hh:mm:ss A')

  // redux
  const categoriesRedux = useSelector((state) => state.categories)
  const occasionsRedux = useSelector((state) => state.occasions)
  const interestsRedux = useSelector((state) => state.interests)
  const recipientsRedux = useSelector((state) => state.recipients)
  const productsRedux = useSelector((state) => state.products)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <div style={colStyle} className="scroll">
          <Tag className="rounded-pill my-1" color="cyan">
            {categ?.find((cat) => cat.id === category)?.name}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Colors',
      dataIndex: 'colors',
      key: 'colors',
      render: (colorsArr) => (
        <div style={colStyle} className="scroll">
          {colorsArr &&
            colorsArr?.map((item) => (
              <Tag className="rounded-pill my-1" color="cyan">
                {colors?.find((cat) => cat.id === item)?.name}
              </Tag>
            ))}
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (brandId) => (
        <div style={colStyle} className="scroll">
          <Tag className="rounded-pill my-1" color="cyan">
            {brands?.find((brand) => brand.id === brandId)?.name}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      // render: (brandId) => (
      //   <div style={colStyle} className="scroll">
      //     <Tag className="rounded-pill my-1" color="cyan">
      //       {brands?.find((brand) => brand.id === brandId)?.name}
      //     </Tag>
      //   </div>
      // ),
    },
    {
      title: 'Cloth Type',
      dataIndex: 'cloth_type',
      key: 'cloth_type',
      render: (clothTypeId) => (
        <div style={colStyle} className="scroll">
          <Tag className="rounded-pill my-1" color="cyan">
            {
              clothTypes?.find((clothType) => clothType.id === clothTypeId)
                ?.name
            }
          </Tag>
        </div>
      ),
    },
    {
      title: 'Price (£)',
      dataIndex: 'price',
      key: 'price',
      render: (price, item) => {
        if (item.discount === '' || !item.discount || item.discount === '0') {
          return item.price
        } else {
          return (
            <span>
              <del className="text-danger fst-italic me-2">
                {item.originalPrice}
              </del>
              <Tooltip title="Discounted Price">
                <Tag className="fw-bold rounded-pill" color="orange">
                  {item.price}
                </Tag>
              </Tooltip>
            </span>
          )
        }
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      render: (id, item) => (
        <div className="d-flex">
          <Tooltip title={`Edit ${item.name}`}>
            <Button
              onClick={() => {
                console.log({ item })
                setProductDetails({ ...item })
                handleEdit(item)
              }}
              className="btnSecondary me-1"
              type="primary"
              // loading={btnUpload}
            >
              <i className="fa fa-edit"></i>
            </Button>
          </Tooltip>
          <Popconfirm
            title="Delete product?"
            description="Are you sure to delete this product?"
            placement="topLeft"
            onConfirm={() => handleDelete(id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            {/* <a href="#">Delete</a> */}
            <Button
              // onClick={() => handleDelete(id)}
              className="btnDanger"
              type="primary"
              // loading={btnUpload}
            >
              <i className="fa fa-trash"></i>
            </Button>
            {/* <Tooltip title={`Delete ${item.name}`}>
            </Tooltip> */}
          </Popconfirm>
        </div>
      ),
    },
  ]

  useEffect(() => {
    getProducts()
    getCategories() // redux
    dispatch(fetchProducts())
    getUsers()
    getWishlist()
    getColors()
    getClothTypes()
    getBrands()
  }, [])

  const getBrands = async () => {
    let data = await getData('brands')
    if (data) {
      setBrands(data)
    }
  }

  const getColors = async () => {
    let data = await getData('colors')
    setColors(data)
  }

  const getClothTypes = async () => {
    let data = await getData('clothTypes')
    setClothTypes(data)
  }

  useEffect(() => {
    setCateg(categoriesRedux.categories)
  }, [categoriesRedux])

  useEffect(() => {
    setOccasions(occasionsRedux.occasions)
  }, [occasionsRedux])

  useEffect(() => {
    setInterests(interestsRedux.interests)
  }, [interestsRedux])
  useEffect(() => {
    const count = productsRedux?.products?.filter((obj) => {
      if (obj?.stats?.featured === true) {
        return true
      }

      return false
    }).length
    setfeaturedCount(() => count)
    dispatch(fetchProducts())
  }, [featuredCount])
  useEffect(() => {
    setRecipients(recipientsRedux.recipients)
  }, [recipientsRedux])

  useEffect(() => {
    setAllProducts(productsRedux.products)
    setSearch(productsRedux.products)
  }, [productsRedux])

  //  products
  const getProducts = async () => {
    if (productsRedux.isLoading) {
      dispatch(fetchProducts())
    }
  }

  // categories
  const getCategories = async () => {
    if (categoriesRedux.isLoading === true) {
      dispatch(fetchCategories())
    }
  }

  // search in products
  const handleSearch = (value) => {
    value = value.trim().toLowerCase()
    var arr = cloneDeep(allProducts)
    arr = arr?.filter((item) => item.name.toLowerCase().includes(value))
    for (var i = 0; i < arr.length; i++) {
      categ.forEach((item) => {
        if (item.id === arr[i].category) {
          arr[i].category = item
        }
      })
    }
    setSearch(arr)
  }

  // add product in modal
  const handleAddProduct = async (values) => {
    if (discount) {
      values.is_discounted = true
    } else {
      values.is_discounted = false
    }
    values.discount = discount
    values.originalPrice = originalPrice
    values.price = discountedPrice === 0 ? values.price : discountedPrice
    values.discountType = discountType
    values.createdDate = new Date()
    values['is-new-product'] = true
    setBtnUpload(true)
    const url = await multiImageUpload('products', values.image.fileList)
    values.image = url
    values.stock = Number(values?.stock)
    values.admin = user // id of admin that posted the product
    let sizes = values?.sizes?.map((size) => size?.toLowerCase())
    values.sizes = sizes
    let response = await addDoc('products', values)
    setBtnUpload(false)
    if (response === true) {
      message.success('Product Created Successfully!')
      handleModalClose()
      getProducts()
      dispatch(fetchProducts())
    }
  }

  // modal close
  const handleModalClose = () => {
    setShow(false)
    form.resetFields()
    setBtnUpload(false)
    setDiscount('')
    setDiscountedPrice(0)
    setOriginalPrice(null)
    setBeforeUpload(null)
  }
  // dummy request
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }
  // delete product
  const handleDelete = async (id) => {
    let prod = productsRedux.products.find((item) => item.id === id)
    // setBtnUpload(true)
    setisLoading(true)
    await firebase
      .firestore()
      .collection('products')
      .doc(id)
      .delete()
      .then(() => {
        message.success('Product Deleted!')
        deleteStorageFiles(prod.image)
        getProducts()
        dispatch(fetchProducts())
        setisLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => setisLoading(false))
  }

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
          // setSearch(arr);
        })
    } catch (error) {
      console.log(error.message)
    }
    setIsLoading(false)
  }
  // edit modal form
  const getWishlist = async () => {
    try {
      await firebase
        .firestore()
        .collection('wishlists')
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
          setAllWishlist(arr)
          // setSearch(arr);
        })
    } catch (error) {
      console.log(error.message)
    }
    setIsLoading(false)
  }
  const sendProductsNotifictaion = (values) => {
    // edit

    const temp = []
    const temp1 = []
    for (const wislist of allWishlist) {
      const wishlistid = wislist?.products?.filter((x) => x.id === edit.id)
      if (wishlistid?.length > 0) temp.push(wislist.userId)
    }
    // getUsersByid(temp)
    const newuser = allUsers.filter((object1) => {
      return temp.some((object2) => {
        return object1.id === object2
      })
    })
    // const filterUser = allUsers.id.filter(temp)
    console.log(newuser, 'email')
    newuser.map((user) => {
      const notification = {
        id: user.id,
        notification: [
          {
            text: `${user.name} , ${edit.name} price has been updated from $${edit.price} to £${values.price}`,
            date: currentdateTime,
          },
        ],
        clicked: true,
      }

      saveData('notification', user.id, notification)
      sendMailFunc({
        targetAdress: user,
      })
        .then((res) => {
          console.log(res, 'Email Sent! res')
        })
        .catch((err) => {
          console.log(err, 'Email Sent err!')
        })

      console.log('Email Sent!')
    })
  }
  const handleEditProduct = async (values) => {
    values.discountType = discountType
    // console.log(values.image);
    setBtnUpload(true)
    // return;
    if (values.image.fileList) {
      console.log(values.image)
      const url = await multiImageUpload('products', values.image.fileList)
      values.image = [...url, ...edit.image]
    } else {
      values.image = [...edit.image]
    }
    console.log('values on eidt product', values.price, edit.price)
    if (values.price !== edit.price) {
      sendProductsNotifictaion(values)
    }

    values.discount = discount
    values.originalPrice = originalPrice
    values.price = discountedPrice === 0 ? values.price : discountedPrice
    values.customLink = text
    let sizes = values?.sizes?.map((size) => size?.toLowerCase())
    values.sizes = sizes
    values.stock = Number(values.stock)

    await firebase
      .firestore()
      .collection('products')
      .doc(edit.id)
      .set(values, { merge: true })
      .then(() => {
        message.success(edit.name + ' updated')
        handleBack()
        getProducts()
        dispatch(fetchProducts())
      }) 
    setBtnUpload(false)
  }

  const handleEdit = (item) => {
    editForm.setFieldsValue({ ...item })
    setDiscountType(item.discountType)
    setDiscount(item.discount ?? '')
    setOriginalPrice(item?.originalPrice ?? item.price)
    setDiscountedPrice(item.price)
    setEdit(item)
    setKey('2')
  }
  const handleBack = () => {
    setEdit(null)
    setKey('1')
    editForm.resetFields()
    setBtnUpload(false)
    setDiscount('')
    setDiscountedPrice(0)
    setOriginalPrice(null)
  }

  // handle discount
  const handleDiscount = (value) => {
    setDiscount(value)
    if (!originalPrice || originalPrice === '') {
      message.warn({
        content: 'Please add Price first!',
        key: 'price_add_first',
      })
      setDiscount('')
      return
    }
    let price
    let disPrice
    if (discountType === '£') {
      disPrice = originalPrice - value
    }
    if (discountType === '%') {
      price = (originalPrice / 100) * value
      disPrice = originalPrice - price
    }
    disPrice = disPrice.toFixed(2)
    setDiscountedPrice(disPrice)
  }
  function containsWhitespace(str) {
    return /\s/.test(str)
  }

  // add category
  const handleAddCategory = async () => {
    setBtnUpload(true)
    const status = await dispatch(addCategory(catSearch))
    if (status === 200) {
      setCatSearch('')
    }
    setBtnUpload(false)
  }
  // add interest
  const handleAddInterest = async () => {
    setBtnUpload(true)
    const status = await dispatch(addInterest(interSearch))
    if (status === 200) {
      setInterSearch('')
    }
    setBtnUpload(false)
  }

  // add occasion
  const handleAddColor = async () => {
    setBtnUpload(true)
    let doc = {
      name: colorSearch,
      label: colorSearch.slice(0, 1).toUpperCase(),
    }
    const response = await addDoc('colors', doc)
    if (response === true) {
      getColors()
    }
    setColorSearch('')
    setBtnUpload(false)
  }

  // Add Cloth Type
  const handleAddClothType = async () => {
    setBtnUpload(true)
    let doc = {
      name: clothTypeSearch,
      label: clothTypeSearch.slice(0, 1).toUpperCase(),
    }
    const response = await addDoc('clothTypes', doc)
    if (response === true) {
      getClothTypes()
    }
    setClothTypeSearch('')
    setBtnUpload(false)
  }

  return (
    <>
      <Container>
        <Tabs animated activeKey={key}>
          <TabPane key="1">
            <Row>
              <Col>
                <Button
                  type="primary"
                  className="btnPrimary"
                  icon={<PlusOutlined />}
                  loading={isLoading}
                  onClick={() => setShow(true)}
                  size="large"
                >
                  Add Product
                </Button>
              </Col>
            </Row>
            <Row className="my-2">
              <Col className="d-flex justify-content-center">
                <Tag
                  className="my-2 rounded-pill font18 px-3 py-2"
                  color="blue"
                >
                  Total Products: {search ? search.length : 0}
                </Tag>
              </Col>
            </Row>
            <Row className="mb-2 d-flex justify-content-end mb-3">
              <Col md={4} className="d-flex">
                <Input
                  type="text"
                  placeholder="Search product"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Table
                  bordered
                  dataSource={search}
                  columns={columns}
                  scroll={{ x: true }}
                  loading={isLoading}
                  pagination={{
                    position: ['bottomCenter'],
                    showSizeChanger: true,
                  }}
                  rowKey={(item) => item.id}
                  expandable={{
                    expandedRowRender: (item) => {
                      return (
                        <div>
                          <Row>
                            <Col>
                              <Space direction="vertical" wrap>
                                <strong>Product ID</strong>
                                <p>{item?.id ?? ''}</p>
                                <strong>Description:</strong>
                                <p style={{ margin: 0, textAlign: 'justify' }}>
                                  {item.description}
                                </p>
                              </Space>
                            </Col>
                          </Row>
                        </div>
                      )
                    },
                  }}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane key="2">
            <Card className="rounded">
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
              {edit && (
                <Form
                  size="large"
                  form={editForm}
                  layout="vertical"
                  onFinish={handleEditProduct}
                >
                  <Row>
                    <Col md={6}>
                      <Item
                        label="Name"
                        name="name"
                        rules={[
                          { required: true, message: 'Please enter title!' },
                        ]}
                        className="fw-bold"
                      >
                        <Input type="text" />
                      </Item>
                    </Col>
                    <Col md={6}>
                      <Item
                        label="Description"
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter description!',
                          },
                        ]}
                        className="fw-bold"
                      >
                        <Input.TextArea />
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Item
                        name="price"
                        label="Price"
                        className="fw-bold"
                        rules={[
                          { required: true, message: 'Please enter price!' },
                        ]}
                      >
                        <Input
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          prefix={<PoundCircleFilled />}
                          type="number"
                        />
                      </Item>
                    </Col>
                    <Col md={4}>
                      <Item
                        label={
                          <>
                            <div>
                              Discount (optional)
                              <div>
                                <Radio.Group
                                  onChange={(e) => {
                                    setDiscountType(e.target.value)
                                    handleDiscount(discount)
                                  }}
                                  value={discountType}
                                >
                                  <Radio title="Flat Discount" value="£">
                                    £
                                  </Radio>
                                  <Radio title="Percentage Discount" value="%">
                                    %
                                  </Radio>
                                </Radio.Group>
                              </div>
                            </div>
                          </>
                        }
                        className="fw-bold"
                      >
                        <Input
                          name="discount"
                          onChange={(e) => handleDiscount(e.target.value)}
                          min={0}
                          value={discount}
                          prefix={discountType}
                          type="number"
                        />
                      </Item>
                      <span>
                        <strong>
                          Discounted Price:{' '}
                          <span className="text-primary">
                            {' '}
                            £ {discountedPrice}
                          </span>
                        </strong>
                      </span>
                    </Col>
                    <Col md={4}>
                      <Item
                        name="stock"
                        label="Stock"
                        className="fw-bold"
                        rules={[
                          { required: true, message: 'Please enter stock!' },
                        ]}
                      >
                        <Input
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          prefix={<PoundCircleFilled />}
                          type="number"
                        />
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Item
                        label="Category"
                        name="category"
                        rules={[
                          {
                            required: true,
                            message: 'Please select category!',
                          },
                        ]}
                        className="fw-bold"
                      >
                        <Select
                          showSearch
                          clearIcon
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          maxTagCount={1}
                          placeholder="Select Category"
                          onSearch={(val) => setCatSearch(val.trim())}
                          notFoundContent={
                            <div
                              onClick={handleAddCategory}
                              title={`Add ${catSearch} to categories`}
                              style={{ cursor: 'pointer', color: 'black' }}
                            >
                              <i className="fa fa-plus me-2 bg-success rounded-circle p-1 text-white"></i>
                              <span className="me-2">Add</span>
                              <span
                                className="px-2"
                                style={{ backgroundColor: '#F0F2F5' }}
                              >
                                {catSearch}
                              </span>
                            </div>
                          }
                          style={{ fontSize: 13, fontWeight: 300 }}
                        >
                          {categ &&
                            categ?.map((item) => {
                              return (
                                <Option value={item.id}>{item.name}</Option>
                              )
                            })}
                        </Select>
                      </Item>
                    </Col>
                    <Col md={6}>
                      <Item
                        label="Colors"
                        name="colors"
                        rules={[
                          {
                            required: true,
                            message: 'Please select product colors!',
                          },
                        ]}
                        className="fw-bold"
                      >
                        <Select
                          showSearch
                          mode="multiple"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          // maxTagCount={3}
                          placeholder="Select Colors"
                          onSearch={(val) => setColorSearch(val.trim())}
                          notFoundContent={
                            <div
                              onClick={handleAddColor}
                              title={`Add ${colorSearch} to Colors`}
                              style={{ cursor: 'pointer', color: 'black' }}
                            >
                              <i className="fa fa-plus me-2 bg-success rounded-circle p-1 text-white"></i>
                              <span className="me-2">Add</span>
                              <span
                                className="px-2"
                                style={{ backgroundColor: '#F0F2F5' }}
                              >
                                {colorSearch}
                              </span>
                            </div>
                          }
                          style={{ fontSize: 13, fontWeight: 300 }}
                        >
                          {colors &&
                            colors?.map((item) => {
                              return (
                                <Option value={item.id}>{item.name}</Option>
                              )
                            })}
                        </Select>
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Item
                        label="Stitched"
                        name="is_stitched"
                        rules={[
                          {
                            required: true,
                            message: 'Please select stitched!',
                          },
                        ]}
                        className="fw-bold"
                      >
                        <Select
                          placeholder="Select Stitched"
                          style={{ fontSize: 13, fontWeight: 300 }}
                        >
                          <Option value={'yes'}>Yes</Option>
                          <Option value={'no'}>No</Option>
                        </Select>
                      </Item>
                    </Col>
                    <Col md={6}>
                      <Item
                        label="Cloth Types"
                        name="cloth_type"
                        rules={[
                          {
                            required: true,
                            message: 'Please select cloth type!',
                          },
                        ]}
                        className="fw-bold"
                      >
                        <Select
                          showSearch
                          maxTagCount={1}
                          clearIcon
                          placeholder="Select Cloth Type"
                          onSearch={(val) => setClothTypeSearch(val.trim())}
                          notFoundContent={
                            <div
                              onClick={handleAddClothType}
                              title={`Add ${clothTypeSearch} to Cloth Types`}
                              style={{ cursor: 'pointer', color: 'black' }}
                            >
                              <i className="fa fa-plus me-2 bg-success rounded-circle p-1 text-white"></i>
                              <span className="me-2">Add</span>
                              <span
                                className="px-2"
                                style={{ backgroundColor: '#F0F2F5' }}
                              >
                                {clothTypeSearch}
                              </span>
                            </div>
                          }
                          style={{ fontSize: 13, fontWeight: 300 }}
                        >
                          {clothTypes &&
                            clothTypes?.map((item) => {
                              return (
                                <Option value={item.id}>{item.name}</Option>
                              )
                            })}
                        </Select>
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Item
                        label="Brand"
                        name="brand"
                        rules={[
                          { required: true, message: 'Please select brand!' },
                        ]}
                        className="fw-bold"
                      >
                        <Select
                          showSearch
                          maxTagCount={1}
                          clearIcon
                          placeholder="Select Brand"
                          style={{ fontSize: 13, fontWeight: 300 }}
                        >
                          {brands &&
                            brands?.map((item) => {
                              return (
                                <Option value={item.id}>{item.name}</Option>
                              )
                            })}
                        </Select>
                      </Item>
                    </Col>
                    <Col md={6}>
                      <Item
                        label="New Product"
                        name={'is-new-product'}
                        rules={[
                          {
                            required: true,
                            message: 'Please select an option!',
                          },
                        ]}
                        className="fw-bold"
                      >
                        <Select
                          placeholder="New Product"
                          style={{ fontSize: 13, fontWeight: 300 }}
                        >
                          <Option value={true}>Yes</Option>
                          <Option value={false}>No</Option>
                        </Select>
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Item
                        label="Sizes"
                        name="sizes"
                        rules={[
                          {
                            required: true,
                            message: 'Please select size!',
                          },
                        ]}
                        className="fw-bold"
                      >
                        <Select
                          showSearch
                          mode="multiple"
                          clearIcon
                          placeholder="Select Sizes"
                          style={{ fontSize: 13, fontWeight: 300 }}
                        >
                          <Option value={'xs'}>XS</Option>
                          <Option value={'s'}>S</Option>
                          <Option value={'m'}>M</Option>
                          <Option value={'l'}>L</Option>
                          <Option value={'xl'}>XL</Option>
                          <Option value={'xxl'}>XXL</Option>
                          <Option value={'xxxl'}>XXXL</Option>
                        </Select>
                      </Item>
                    </Col>
                    <Col md={6}>
                      <Item
                        label="New Image(s)"
                        name="image"
                        // rules={[
                        //   { required: true, message: 'Please select images!' },
                        // ]}
                        className="fw-bold"
                      >
                        <Upload
                          accept="image/*"
                          customRequest={dummyRequest}
                          onRemove={() => {
                            setFileName('')
                          }}
                          listType="picture"
                          multiple
                        >
                          <Button icon={<UploadOutlined />}>
                            Click to Upload
                          </Button>
                        </Upload>
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Item label="Product Images" className="fw-bold d-flex">
                        {edit &&
                          edit?.image?.map((item, index) => (
                            <div className="position-relative d-flex">
                              <div>
                                <i
                                  className="fas fa-trash fs-5"
                                  style={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    let arr = [...productDetails?.image]
                                    arr?.splice(index, 1)
                                    setEdit((prev) => ({
                                      ...prev,
                                      image: [...arr],
                                    }))
                                  }}
                                ></i>
                                <Avatar
                                  size={80}
                                  style={{ cursor: 'pointer' }}
                                  key={item}
                                  className="me-2"
                                  shape="square"
                                  src={<Image src={item} preview={true} />}
                                />
                              </div>
                            </div>
                          ))}
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
                        Update
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card>
          </TabPane>
        </Tabs>
        <BackTop>
          <div style={backToTop}>
            <i className="fas fa-arrow-up"></i>
          </div>
        </BackTop>
        {/* add new product */}
        <Modal
          title="Add Product"
          visible={show}
          footer={false}
          onCancel={handleModalClose}
          width="900px"
        >
          <Form
            size="large"
            form={form}
            layout="vertical"
            onFinish={handleAddProduct}
          >
            <Row>
              <Col md={6}>
                <Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter title!' }]}
                  className="fw-bold"
                >
                  <Input type="text" />
                </Item>
              </Col>
              <Col md={6}>
                <Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: 'Please enter description!' },
                  ]}
                  className="fw-bold"
                >
                  <Input.TextArea />
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Item
                  label="Stock"
                  name="stock"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter available stock!',
                    },
                  ]}
                  className="fw-bold"
                >
                  <Input
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    type="number"
                  />
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Item
                  name="price"
                  label="Price"
                  className="fw-bold"
                  rules={[{ required: true, message: 'Please enter price!' }]}
                >
                  <Input
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    prefix={<PoundCircleFilled />}
                    type="number"
                  />
                </Item>
              </Col>
              <Col>
                <Item
                  label={
                    <>
                      <div>
                        Discount (optional)
                        <div>
                          <Radio.Group
                            onChange={(e) => {
                              setDiscountType(e.target.value)
                              handleDiscount(0)
                            }}
                            value={discountType}
                          >
                            <Radio title="Flat Discount" value="£">
                              £
                            </Radio>
                            <Radio title="Percentage Discount" value="%">
                              %
                            </Radio>
                          </Radio.Group>
                        </div>
                      </div>
                    </>
                  }
                  className="fw-bold"
                >
                  <Input
                    name="discount"
                    onChange={(e) => handleDiscount(e.target.value)}
                    min={0}
                    max={
                      discountType === '%' ? 90 : form.getFieldValue('price')
                    }
                    value={discount}
                    prefix={discountType}
                    type="number"
                  />
                </Item>
                <span>
                  <strong>
                    Discounted Price:{' '}
                    <span className="text-primary">
                      {' '}
                      {discountType} {discountedPrice}
                    </span>
                  </strong>
                </span>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Item
                  label="Category"
                  name="category"
                  rules={[
                    { required: true, message: 'Please select category!' },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    clearIcon
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    maxTagCount={1}
                    placeholder="Select Category"
                    onSearch={(val) => setCatSearch(val.trim())}
                    notFoundContent={
                      <div
                        onClick={handleAddCategory}
                        title={`Add ${catSearch} to categories`}
                        style={{ cursor: 'pointer', color: 'black' }}
                      >
                        <i className="fa fa-plus me-2 bg-success rounded-circle p-1 text-white"></i>
                        <span className="me-2">Add</span>
                        <span
                          className="px-2"
                          style={{ backgroundColor: '#F0F2F5' }}
                        >
                          {catSearch}
                        </span>
                      </div>
                    }
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    {categ &&
                      categ?.map((item) => {
                        return <Option value={item.id}>{item.name}</Option>
                      })}
                  </Select>
                </Item>
              </Col>
              <Col md={6}>
                <Item
                  label="Colors"
                  name="colors"
                  rules={[
                    {
                      required: true,
                      message: 'Please select product colors!',
                    },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    // maxTagCount={3}
                    placeholder="Select Colors"
                    onSearch={(val) => setColorSearch(val.trim())}
                    notFoundContent={
                      <div
                        onClick={handleAddColor}
                        title={`Add ${colorSearch} to Colors`}
                        style={{ cursor: 'pointer', color: 'black' }}
                      >
                        <i className="fa fa-plus me-2 bg-success rounded-circle p-1 text-white"></i>
                        <span className="me-2">Add</span>
                        <span
                          className="px-2"
                          style={{ backgroundColor: '#F0F2F5' }}
                        >
                          {colorSearch}
                        </span>
                      </div>
                    }
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    {colors &&
                      colors?.map((item) => {
                        return <Option value={item.id}>{item.name}</Option>
                      })}
                  </Select>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Item
                  label="Stitched"
                  name="is_stitched"
                  rules={[
                    { required: true, message: 'Please select stitched!' },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    placeholder="Select Stitched"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    <Option value={'yes'}>Yes</Option>
                    <Option value={'no'}>No</Option>
                  </Select>
                </Item>
              </Col>
              <Col md={6}>
                <Item
                  label="Cloth Types"
                  name="cloth_type"
                  rules={[
                    { required: true, message: 'Please select cloth type!' },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    maxTagCount={1}
                    clearIcon
                    placeholder="Select Cloth Type"
                    onSearch={(val) => setClothTypeSearch(val.trim())}
                    notFoundContent={
                      <div
                        onClick={handleAddClothType}
                        title={`Add ${clothTypeSearch} to Cloth Types`}
                        style={{ cursor: 'pointer', color: 'black' }}
                      >
                        <i className="fa fa-plus me-2 bg-success rounded-circle p-1 text-white"></i>
                        <span className="me-2">Add</span>
                        <span
                          className="px-2"
                          style={{ backgroundColor: '#F0F2F5' }}
                        >
                          {clothTypeSearch}
                        </span>
                      </div>
                    }
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    {clothTypes &&
                      clothTypes?.map((item) => {
                        return <Option value={item.id}>{item.name}</Option>
                      })}
                  </Select>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Item
                  label="Brand"
                  name="brand"
                  rules={[{ required: true, message: 'Please select brand!' }]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    maxTagCount={1}
                    clearIcon
                    placeholder="Select Brand"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    {brands &&
                      brands?.map((item) => {
                        return <Option value={item.id}>{item.name}</Option>
                      })}
                  </Select>
                </Item>
              </Col>
              <Col md={6}>
                <Item
                  label="New Product"
                  name={'is-new-product'}
                  rules={[
                    { required: true, message: 'Please check this field!' },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    placeholder="Select Stitched"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    <Option value={'yes'}>Yes</Option>
                    <Option value={'no'}>No</Option>
                  </Select>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Item
                  label="Sizes"
                  name="sizes"
                  rules={[
                    {
                      required: true,
                      message: 'Please select cloth type!',
                    },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    mode="multiple"
                    clearIcon
                    placeholder="Select Sizes"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    <Option value={'xs'}>XS</Option>
                    <Option value={'s'}>S</Option>
                    <Option value={'m'}>M</Option>
                    <Option value={'L'}>L</Option>
                    <Option value={'XL'}>XL</Option>
                    <Option value={'XXl'}>XXL</Option>
                    <Option value={'XXXL'}>XXXL</Option>
                  </Select>
                </Item>
              </Col>
              <Col md={6}>
                <Item
                  label="Image"
                  name="image"
                  rules={[{ required: true, message: 'Please select images!' }]}
                  className="fw-bold"
                >
                  <Upload
                    accept="image/*"
                    customRequest={dummyRequest}
                    onRemove={() => {
                      setFileName('')
                    }}
                    listType="picture"
                    multiple
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
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
                  Post Product
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Container>
      {/* {beforeUpload && (
        <Modal
          title="Change Image Name"
          visible={fileModal}
          onCancel={() => setFileModal(false)}
          footer={null}
        >
          {beforeUpload.image.fileList?.map((item, idx) => (
            <div>
              <div className="d-flex justify-content-center">
                <Image
                  preview={false}
                  src={item.thumbUrl}
                  alt={item.name}
                  width="100px"
                  height="100px"
                />
              </div>
              <Input
                defaultValue={item.name}
                onChange={(e) => handleChangeFileName(e.target.value, idx)}
              />
            </div>
          ))}
          <div className="d-flex justify-content-end mt-3">
            <Button onClick={handleOkFileModal} type="primary">
              Save
            </Button>
          </div>
        </Modal>
      )} */}
    </>
  )
}

export default Products
