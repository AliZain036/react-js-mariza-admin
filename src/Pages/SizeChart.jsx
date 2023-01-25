import { InboxOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Col,
  Form,
  Image,
  message,
  Modal,
  Row,
  Spin,
} from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { getData, singleImageUpload, updateDoc } from '../Firebase/utils'

const SizeChart = () => {
  const [show, setShow] = useState(false)
  const [sizeChartForm] = Form.useForm()
  const [sizeChart, setSizeChart] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchSizeChart()
  }, [])

  const fetchSizeChart = async () => {
    try {
      setLoading(true)
      let data = await getData('sizechart')
      setLoading(false)
      setSizeChart(data[0])
      console.log(data)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleUpdateSizeChart = async (values) => {
    setLoading(true)
    let uploadedImageURL = sizeChart?.image
    if (values?.size_chart) {
      let imageFile = values.size_chart.file.originFileObj
      uploadedImageURL = await singleImageUpload('size-chart', imageFile)
    }
    setLoading(true)
    let response = await updateDoc('sizechart', sizeChart?.id, {
      image: uploadedImageURL,
    })
    if (response) {
      sizeChartForm.resetFields()
      message.success('Size Chart has been updated!')
      setShow(false)
      fetchSizeChart()
    }
  }

  return (
    <Spin spinning={loading}>
      <Container>
        <div className="mt-4">
          <div className="d-flex align-items-center gap-3">
            <h5 className="m-0">Size Chart</h5>
            <Button
              type="primary"
              className="btnPrimary"
              icon={<PlusOutlined />}
              onClick={() => setShow(true)}
              size="large"
            >
              Update Size Chart
            </Button>
          </div>
          <div className="mt-3">
            <Avatar
              size={300}
              style={{ cursor: 'pointer' }}
              className="m-auto"
              shape="square"
              src={<Image src={sizeChart?.image} preview={true} />}
            />
          </div>
          <Modal
            title="Update Size Chart"
            visible={show}
            footer={false}
            onCancel={() => setShow(false)}
          >
            <Form
              size="large"
              form={sizeChartForm}
              onFinish={handleUpdateSizeChart}
              layout={'vertical'}
            >
              <Form.Item label="Size Chart" name={'size_chart'}>
                <Dragger listType="picture" maxCount={1}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">Select single image</p>
                </Dragger>
              </Form.Item>
              <Form.Item label="Existing Size Chart" name={'size_chart'}>
                <Avatar
                  size={50}
                  style={{ cursor: 'pointer' }}
                  className="me-2"
                  shape="square"
                  src={<Image src={sizeChart?.image} preview={true} />}
                />
              </Form.Item>
              {/* <Row>
                <Col md={12}></Col>
              </Row> */}
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  className="btnPrimary w-25 text-right"
                  htmlType="submit"
                  loading={loading}
                  style={{ marginLeft: 'auto' }}
                >
                  Update
                </Button>
              </div>
              {/* <Row>
                <Col md={12}></Col>
              </Row> */}
            </Form>
          </Modal>
        </div>
      </Container>
    </Spin>
  )
}

export default SizeChart
