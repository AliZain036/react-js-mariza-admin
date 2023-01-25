import React, { useEffect, useState } from 'react'
import { firebase } from '../Firebase/config'
import { Container, Row, Col } from 'react-bootstrap'
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Tabs,
  Table,
  Image,
  Avatar,
  Space,
  Modal,
  Tooltip,
} from 'antd'
import {
  InboxOutlined,
  DeleteFilled,
  ArrowLeftOutlined,
  EditFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { multiImageUpload, singleImageUpload } from '../Firebase/utils.js'
import { cloneDeep } from 'lodash'

const { Item } = Form
const { Dragger } = Upload
const { TabPane } = Tabs

const Banners = () => {
  //state
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [banners, setBanners] = useState([])
  const [btnLoading, setBtnLoading] = useState(false)
  const [key, setKey] = useState('1')
  const [edit, setEdit] = useState(null)
  const [show, setShow] = useState(false)

  // table
  const columns = [
    {
      title: 'Banner Name',
      dataIndex: 'name',
      key: 'name',
    },
    // {
    //   title: "Image URL",
    //   dataIndex: "link",
    //   key: "link",
    //   render: (url) =>
    //     url && (
    //       <a href={url} target="_blank" className="mt-0" rel="noreferrer">
    //         Link
    //       </a>
    //     ),
    // },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (url) => (
        <div className="d-flex flex-wrap">
          <Avatar size={65} shape="square" src={<Image src={url} />} />
          {/* {list.map((item) => (
            <div
              key={item}
              className="d-flex align-items-center flex-column me-2"
            >
            </div>
          ))} */}
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
            loading={btnLoading === id}
            onClick={() => handleEdit(item)}
            className="btnSecondary text-white"
          >
            <EditFilled />
          </Button>
          <Button
            loading={btnLoading === id}
            onClick={() => handleDelete(id)}
            className="btnDanger text-white"
          >
            <DeleteFilled />
          </Button>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    getBanners()
  }, [])

  const getBanners = async () => {
    setIsLoading(true)
    firebase
      .firestore()
      .collection('banners')
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
        console.log({ arr })
        setBanners(arr)
        setIsLoading(false)
      })
      .catch((e) => console.log(e))
  }

  const handleSubmit = async (values) => {
    setIsLoading(true)
    let imageFile = values.image.file.originFileObj
    let uploadedImageURL = await singleImageUpload('banners', imageFile)
    let data = {
      name: values.name,
      image: uploadedImageURL,
      // link: values.link,
    }
    console.log(data)
    await firebase
      .firestore()
      .collection('banners')
      .add(data)
      .then(async (doc) => {
        setIsLoading(false)
        message.success('Banner Created Successfully!')
        form.resetFields()
        await getBanners()
        setKey('1')
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // delete
  const handleDelete = async (id) => {
    setBtnLoading(id)
    firebase
      .firestore()
      .collection('banners')
      .doc(id)
      .delete()
      .then(async (doc) => {
        message.success('Banner Deleted.')
        await getBanners()
        setBtnLoading('')
      })
      .catch((e) => {
        setBtnLoading('')
        console.log(e)
      })
  }

  const handleEdit = (values) => {
    setEdit(values)
    setShow(true)
    editForm.setFieldsValue({
      name: values.name,
      link: values?.link,
    })
  }

  const handleEditSubmit = async (values) => {
    setBtnLoading(edit.id)
    setIsLoading(true)
    let imageURL = edit.image
    console.log(values)
    // if (values.images) {
    //   if (values.images.fileList.length > 0) {
    //     console.log(values.images.fileList)
    //     let newImageURL = await multiImageUpload(
    //       'banners',
    //       values.images.fileList,
    //     )
    //     imageURL = [...imageURL, ...newImageURL]
    //   }
    // }
    let image_url
    if (values.image) {
      image_url = await singleImageUpload(
        'brand-images',
        values.image.file.originFileObj,
      )
    }
    let obj = {
      name: values.name,
      // link: values.link,
      image: values.image ? image_url : edit.image,
    }
    await firebase
      .firestore()
      .collection('banners')
      .doc(edit.id)
      .set(obj, { merge: true })
      .then(async (doc) => {
        message.success('Banner updated!')
        await getBanners()
        handleClose()
      })
      .catch((e) => console.log(e))
    setBtnLoading('')
    setIsLoading(false)
  }

  const handleClose = () => {
    setShow(false)
    setEdit(null)
  }

  const handleRemoveImage = (idx) => {
    console.log(idx)
    let arr = cloneDeep(edit.images)
    arr = arr.filter((item, indx) => idx !== indx)
    setEdit({
      ...edit,
      images: arr,
    })
  }

  // dummy request
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  return (
    <>
      <Container className="mt-4 p-1 p-lg-5" style={{ minHeight: '100vh' }}>
        <Tabs animated renderTabBar={(props) => <></>} activeKey={key}>
          <TabPane key="1">
            <Row className="mb-3">
              <Col className="d-flex align-items-center my-2">
                <h5 className="m-0">Banners Images</h5>
                <Button
                  onClick={() => setKey('2')}
                  className="btnPrimary text-white ms-3"
                >
                  Add Banners / Images
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table
                  dataSource={banners}
                  columns={columns}
                  scroll={{ x: true }}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane key="2">
            <Row className="mb-3">
              <Col>
                <Button
                  onClick={() => setKey('1')}
                  className="btnSecondary text-white ms-3"
                >
                  <ArrowLeftOutlined /> Back
                </Button>
              </Col>
            </Row>
            <Form
              size="large"
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
              <Row>
                <Col lg={6}>
                  <Item
                    name="name"
                    label="Banner Name"
                    rules={[{ message: 'Required field.', required: true }]}
                  >
                    <Input type="text" placeholder="Enter banner name" />
                  </Item>
                </Col>
                {/* <Col lg={6}>
                  <Item
                    name="link"
                    label="Image URL"
                    rules={[{ message: "Required field.", required: true }]}
                  >
                    <Input type="text" placeholder="Enter image url" />
                  </Item>
                </Col> */}
              </Row>
              <Row>
                <Col>
                  <Item
                    name="image"
                    label="Image"
                    tooltip="Upload single or multiple image"
                    rules={[{ message: 'Required field.', required: true }]}
                  >
                    <Dragger
                      multiple
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
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button
                    type="primary"
                    className="btnPrimary w-25"
                    htmlType="submit"
                    loading={isLoading}
                  >
                    Post
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </Container>
      {edit && (
        <Modal visible={show} width={700} onCancel={handleClose} footer={null}>
          <Form
            size="large"
            layout="vertical"
            form={editForm}
            onFinish={handleEditSubmit}
          >
            <Row>
              <Col>
                <Item
                  name="name"
                  label="Banner Name"
                  rules={[{ message: 'Required field.', required: true }]}
                >
                  <Input type="text" placeholder="Enter banner name" />
                </Item>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Item
                  name="link"
                  label="Image URL"
                  rules={[{ message: "Required field.", required: true }]}
                >
                  <Input type="text" placeholder="Enter image url" />
                </Item>
              </Col>
            </Row> */}
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
                    src={<Image src={edit.image} preview={true} />}
                  />
                  {/* {edit.images.map((it, idx) => (
                  ))} */}
                </Space>
              </Col>
            </Row>
            <Row>
              <Col>
                <Item
                  name="image"
                  label="Image"
                  tooltip="Upload single or multiple images"
                >
                  <Dragger
                    multiple
                    maxCount={1}
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
                </Item>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button
                  type="primary"
                  className="btnPrimary w-25"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Post
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  )
}

export default Banners
