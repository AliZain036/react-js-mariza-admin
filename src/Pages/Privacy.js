import React, { useEffect, useState } from 'react'
import { firebase } from '../Firebase/config'
import { Container, Row, Col } from 'react-bootstrap'
import { Spin, Button, message } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react'
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ClassicExtended from 'ckeditor5-build-classic-extended'

const Privacy = () => {
  //state
  const [isLoading, setIsLoading] = useState(false)
  const [privacy, setPrivacy] = useState(null)
  const [btnLoading, setBtnLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    firebase
      .firestore()
      .collection('privacyPolicy')
      .doc('privacy')
      .get()
      .then((doc) => {
        setPrivacy(doc?.data()?.privacy)
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleEditorChange = (event, editor) => {
    const data = editor.getData()
    setPrivacy(data)
  }

  const handleSubmit = () => {
    setBtnLoading(true)
    firebase
      .firestore()
      .collection('privacyPolicy')
      .doc('privacy')
      .set({ privacy }, { merge: true })
      .then((doc) => {
        setBtnLoading(false)
        message.success('Privacy Policy Updated!')
      })
      .catch((e) => console.log(e))
  }

  return (
    <>
      <Container className="mt-4 p-1 p-lg-5" style={{ minHeight: '100vh' }}>
        <Row>
          <Col>
            <h5>Privacy Policy</h5>
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
                data={privacy}
                config={{
                  toolbar: [
                    'heading',
                    'alignment',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'subscript',
                    'superscript',
                    'numberedList',
                    'List',
                    'ListUI',
                    'BlockQuote',
                    'Undo',
                    'Redo',
                    'Image',
                    'ImageCaption',
                    'ImageStyle',
                    'ImageToolbar',
                    'ImageUpload',
                  ],
                }}
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
