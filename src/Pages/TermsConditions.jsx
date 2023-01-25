import React, { useEffect, useState } from 'react'
import { firebase } from '../Firebase/config'
import { Container, Row, Col } from 'react-bootstrap'
import { Spin, Button, message } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react'

import ClassicExtended from 'ckeditor5-build-classic-extended'

const Privacy = () => {
  //state
  const [isLoading, setIsLoading] = useState(false)
  const [terms, setTerms] = useState(null)
  const [btnLoading, setBtnLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    firebase
      .firestore()
      .collection('termsConditions')
      .doc('terms')
      .get()
      .then((doc) => {
        setTerms(doc.data().terms)
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleSubmit = (values) => {
    setBtnLoading(true)
    firebase
      .firestore()
      .collection('termsConditions')
      .doc('terms')
      .set({ terms }, { merge: true })
      .then((doc) => {
        setBtnLoading(false)
        message.success('Terms & Conditions Updated!')
      })
      .catch((e) => console.log(e))
  }

  const handleEditorChange = (event, editor) => {
    const data = editor.getData()
    setTerms(data)
  }

  return (
    <>
      <Container className="mt-4 p-1 p-lg-5" style={{ minHeight: '100vh' }}>
        <Row>
          <Col>
            <h5>Terms & Conditions</h5>
          </Col>
        </Row>
        {isLoading ? (
          <Row>
            <Col className="d-flex justify-content-center">
              <Spin size="large" />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={12}>
              <CKEditor
                editor={ClassicExtended}
                data={terms}
                onChange={handleEditorChange}
              />
            </Col>
            <Col xs={12} className="d-flex justify-content-end mt-3">
              <Button
                type="primary"
                className="btnPrimary w-25"
                htmlType="submit"
                loading={btnLoading}
                onClick={handleSubmit}
              >
                Post
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

export default Privacy
