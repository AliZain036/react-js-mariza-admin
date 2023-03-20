import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Spin,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { addDoc, getData, updateDoc } from '../Firebase/utils'
import { firebase } from '../Firebase/config'

const SpecialOffer = () => {
  const [offerDetail, setOfferDetail] = useState({})
  const [isUpdateOfferModalOpen, setIsUpdateOfferModalOpen] = useState(false)
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false)
  const [addSpecialOfferForm] = Form.useForm()
  const [updateForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetchAllProducts()
    fetchOfferDetail()
  }, [])

  const fetchOfferDetail = async () => {
    try {
      setLoading(true)
      const data = await getData('specialOffer')
      setLoading(false)
      setOfferDetail(data[0])
      //   updateForm.setFields([{name: 'offer', value}])
      console.log(data[0])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      let response = await firebase
        .firestore()
        .collection('products')
        .where('is_discounted', '==', false)
        .get()
      let data = response.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
      setProducts(data)
      console.log({ data })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOffer = async (formValues) => {
    try {
      setLoading(true)
      firebase
        .firestore()
        .collection('specialOffer')
        .doc(offerDetail.id)
        .update(formValues)
        .then(() => {
          message.success('Special offer updated successfully!')
          setIsUpdateOfferModalOpen(false)
          fetchOfferDetail()
        })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  console.log({ products, offerDetail })

  const handleAddSpecialOffer = async (formValues) => {
    try {
      //   const filteredProducts = products.filter((product) =>
      //     formValues.products.includes(product.id),
      //   )
      //   formValues.products = [...filteredProducts]
      setLoading(true)
      const result = await addDoc('specialOffer', formValues)
      if (result === true) {
        message.success('Special offer added successfully!')
        setIsAddOfferModalOpen(false)
        fetchOfferDetail()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Spin spinning={loading}>
        {offerDetail?.isActive === false && loading === false && (
          <h3>There is no special offer </h3>
        )}
        <Container>
          <div className="mt-5 d-flex align-items-center gap-3">
            <h3 className="m-0">Special Offer</h3>
            <div className="d-flex align-items-center gap-2">
              {offerDetail?.isActive === true && (
                <Button
                  className="btnPrimary"
                  htmlType="button"
                  type="primary"
                  onClick={() => setIsUpdateOfferModalOpen(true)}
                >
                  Update
                </Button>
              )}
              {!offerDetail?.isActive && (
                <Button
                  className="btnPrimary"
                  htmlType="button"
                  type="primary"
                  onClick={() => setIsAddOfferModalOpen(true)}
                >
                  Add Offer
                </Button>
              )}
            </div>
          </div>
          <p className='mt-3'>
            <b>*Note: </b>Products with discount cannot be added to special
            offer. Discount should be removed from products in order to add them
            to special offer.
          </p>
          {offerDetail?.isActive && (
            <>
              <div className="mt-3" style={{ marginTop: '1px solid' }}>
                <h5>Offer: {offerDetail?.offer}%</h5>
              </div>
              <div className="mt-3">
                <h5>Active: {offerDetail?.isActive ? 'Yes' : 'False'}</h5>
              </div>
              <div className="mt-3">
                <h5>Products List</h5>
                <div className="mt-2">
                  <Row>
                    {offerDetail &&
                      offerDetail?.products?.map((pro) => {
                        let product = products?.find((item) => item?.id === pro)
                        if (product) {
                          return (
                            <Col md={6} key={product?.id}>
                              <div style={{ border: '1px solid lightgrey' }}>
                                <Avatar
                                  size={100}
                                  style={{ cursor: 'pointer' }}
                                  className="me-2"
                                  shape="square"
                                  src={
                                    <Image
                                      src={product?.image && product?.image[0]}
                                      preview={true}
                                    />
                                  }
                                />
                                <p>
                                  <strong>Name: {product.name}</strong>
                                </p>
                                <p>
                                  <strong>
                                    Description: {product.description}
                                  </strong>
                                </p>
                              </div>
                            </Col>
                          )
                        }
                      })}
                  </Row>
                </div>
              </div>
            </>
          )}
        </Container>
        <Modal
          title="Add Offer"
          visible={isAddOfferModalOpen}
          footer={false}
          onCancel={() => setIsAddOfferModalOpen(false)}
          width="900px"
        >
          <Form
            size="large"
            form={addSpecialOfferForm}
            layout="vertical"
            onFinish={handleAddSpecialOffer}
          >
            <Row>
              <Col md={6}>
                <Form.Item
                  label="Offer"
                  name="offer"
                  rules={[{ required: true, message: 'Please add offer!' }]}
                  className="fw-bold"
                >
                  <Input type="number" min={0} max={90} />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item
                  label="Active"
                  name="isActive"
                  rules={[
                    {
                      required: true,
                      message: 'Please select one field!',
                    },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    clearIcon
                    maxTagCount={1}
                    placeholder="Select Active Status"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Item
                  label="Products"
                  name="products"
                  rules={[
                    {
                      required: true,
                      message: 'Please select at least one product!',
                    },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    clearIcon
                    mode="multiple"
                    // maxTagCount={1}
                    placeholder="Select Active Status"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    {products &&
                      products?.map((item) => {
                        return (
                          <Select.Option value={item.id} key={item.id}>
                            {item.name}
                          </Select.Option>
                        )
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button
                  className="btnPrimary"
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="Update Offer"
          visible={isUpdateOfferModalOpen}
          footer={false}
          onCancel={() => setIsUpdateOfferModalOpen(false)}
          width="900px"
        >
          <Form
            size="large"
            form={updateForm}
            layout="vertical"
            onFinish={handleUpdateOffer}
            initialValues={{
              offer: offerDetail?.offer,
              isActive: offerDetail?.isActive,
              products: offerDetail?.products,
            }}
          >
            <Row>
              <Col md={6}>
                <Form.Item
                  label="Offer"
                  name="offer"
                  rules={[{ required: true, message: 'Please add offer!' }]}
                  className="fw-bold"
                >
                  <Input type="number" min={0} max={90} />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item
                  label="Active"
                  name="isActive"
                  rules={[
                    {
                      required: true,
                      message: 'Please select one field!',
                    },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    clearIcon
                    maxTagCount={1}
                    placeholder="Select Active Status"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Item
                  label="Products"
                  name="products"
                  rules={[
                    {
                      required: true,
                      message: 'Please select at least one product!',
                    },
                  ]}
                  className="fw-bold"
                >
                  <Select
                    showSearch
                    clearIcon
                    mode="multiple"
                    // maxTagCount={1}
                    placeholder="Select Active Status"
                    style={{ fontSize: 13, fontWeight: 300 }}
                  >
                    {products &&
                      products?.map((item) => {
                        return (
                          <Select.Option value={item.id} key={item.id}>
                            {item.name}
                          </Select.Option>
                        )
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button
                  className="btnPrimary"
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                >
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Spin>
    </>
  )
}

export default SpecialOffer
