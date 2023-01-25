/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {
  Button,
  BackTop,
  Tabs,
  Tag,
  Input,
  Image,
  Form,
  Upload,
  message,
  Card,
} from 'antd'
import { backToTop } from './styles/styles'
import { firebase } from '../Firebase/config'
import { singleImageUpload } from '../Firebase/utils'
import { cloneDeep } from 'lodash'
import renderHTML from 'react-render-html'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicExtended from 'ckeditor5-build-classic-extended'

const { TabPane } = Tabs
const { Item } = Form

const BlogPosts = () => {
  // state
  const editor = useRef(null)
  const [allPosts, setAllPosts] = useState(null)
  const [search, setSearch] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [edit, setEdit] = useState(null)
  const [activeKey, setActiveKey] = useState('1')
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

  useEffect(() => {
    getPosts()
  }, [])

  const getPosts = async () => {
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('blogPosts')

      .get()
      .then((allDocs) => {
        let arr = []
        allDocs.forEach((item) => {
          let obj = item.data()
          obj.id = item.id
          arr.push(obj)
        })
        setAllPosts(arr)
        setSearch(arr)
      })
    setIsLoading(false)
  }
  // dummy request
  console.log(allPosts, 'arr')
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }
  //  search
  const handleSearch = (value) => {
    value = value.trim().toLowerCase()
    let arr = cloneDeep(allPosts)
    arr = arr.filter((item) => item.title.toLowerCase().trim().includes(value))
    console.log(arr)
    setSearch(arr)
  }
  // handle add new blog post
  const handleSubmit = async (values) => {
    setIsLoading(true)
    values.image = values.image.file.originFileObj
    const url = await singleImageUpload('blog-posts', values.image)
    if (url) {
      values.image = url
    }
    values.createdat = new Date()
    console.log(values, 'values')
    await firebase
      .firestore()
      .collection('blogPosts')
      .add(values)
      .then(() => {
        message.success('Blog Post Created!')
        handleBack()
        getPosts()
      })
      .catch((e) => {
        message.error('Error Creating Blog Post!')
      })
    form.resetFields()
    setIsLoading(false)
  }
  // edit blog post
  const handleEdit = (item) => {
    setEdit({ ...item })
    Object.entries(item).map(([key, value]) => {
      if (key === 'image') {
        return
      }
      editForm.setFieldsValue({
        [key]: value,
      })
    })
    setActiveKey('2')
  }

  const handleBack = () => {
    form.resetFields()
    editForm.resetFields()
    setActiveKey('1')
  }

  // edit blog post
  const handleEditSubmit = async (values) => {
    setIsLoading(true)
    if (values.image) {
      values.image = values.image.file.originFileObj
      const url = await singleImageUpload('blog-posts', values.image)
      values.image = url
    } else {
      values.image = edit.image
    }
    await firebase
      .firestore()
      .collection('blogPosts')
      .doc(edit.id)
      .set(values, { merge: true })
      .then(() => {
        message.success('Blog Post Updated!')
        setEdit(null)
        handleBack()
        getPosts()
      })
      .catch((error) => {
        message.error('Error Updating Blog Post!')
      })
    setIsLoading(false)
  }

  // delete blog post
  const handleDelete = async (id) => {
    console.log(id)
    setIsLoading(true)
    await firebase
      .firestore()
      .collection('blogPosts')
      .doc(id)
      .delete()
      .then(() => {
        message.success('Blog Post Deleted!')
        getPosts()
      })
      .catch((error) => {
        message.error('Error Deleting Blog Post!')
      })
    setIsLoading(false)
  }

  return (
    <>
      <Container>
        <Tabs animated activeKey={activeKey}>
          <TabPane key="1">
            <Row>
              <Col>
                <Button
                  loading={isLoading}
                  size="large"
                  type="primary"
                  className="btnPrimary"
                  onClick={() => setActiveKey('3')}
                >
                  + Add Blog Posts
                </Button>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="d-flex justify-content-center">
                <Tag
                  className="my-2 rounded-pill font18 px-3 py-2"
                  color="blue"
                >
                  Total Blog Posts: {search ? search.length : 0}
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
            <div></div>
            <div>
              <Row className="mb-4 mx-1 mt-2">
                {search.length > 0 &&
                  search.map((item) => (
                    <Col xs={12} sm={6} md={4} xl={3}>
                      <div className="cardLayout my-2">
                        <div className="text-center ">
                          <Image
                            src={item?.image ?? ''}
                            alt={item.title}
                            style={{
                              height: 230,
                              width: 230,
                              borderRadius: 16,
                              // margin: "auto",
                              // backgroundPosition: "center",
                              backgroundSize: 'cover',
                              cursor: 'pointer',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <div className="center mb-2 threedots">
                          <Tag
                            style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}
                            color="red"
                            className="rounded-pill  px-2 py-1 mt-3 w-100 px-3  "
                          >
                            {item.title}
                          </Tag>
                        </div>
                        <div
                          className="px-2 threedotswith-four-lines"
                          style={{ height: '100px' }}
                        >
                          <small style={{ textAlign: 'justify' }}>
                            {renderHTML(item.content)}
                          </small>
                        </div>
                        <div className="d-flex justify-content-end p-2">
                          <Button
                            size="small"
                            className="btnSecondary me-1"
                            type="primary"
                            onClick={() => handleEdit(item)}
                          >
                            <i className="fa fa-edit"></i>
                          </Button>
                          <Button
                            size="small"
                            className="btnDanger"
                            type="primary"
                            onClick={() => handleDelete(item.id)}
                            loading={isLoading}
                          >
                            <i className="fa fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>
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
              <Row>
                {edit && (
                  <Col>
                    <Form
                      onFinish={handleEditSubmit}
                      form={editForm}
                      layout="vertical"
                      className=""
                      size="large"
                    >
                      <Row>
                        <Col md={6}>
                          <Item
                            label="Title"
                            name="title"
                            rules={[
                              { message: 'Required Field', required: true },
                            ]}
                          >
                            <Input type="text" />
                          </Item>
                        </Col>
                        <Col md={6}>
                          <Item
                            label="Post By"
                            name="postBy"
                            rules={[
                              { message: 'Required Field', required: true },
                            ]}
                          >
                            <Input type="text" />
                          </Item>
                        </Col>
                      </Row>
                      <Col md={6}>
                        <Item label="Image" name="image">
                          <Upload
                            listType="picture"
                            maxCount={1}
                            accept=".png,.jpeg,.jpg"
                            customRequest={dummyRequest}
                          >
                            <Button>Browse</Button>
                          </Upload>
                        </Item>
                      </Col>
                      <Row>
                        <Col>
                          <Item
                            label="Content"
                            name="content"
                            rules={[
                              { message: 'Required Field', required: true },
                            ]}
                          >
                            {/* <CKEditor
                              editor={ClassicEditor}
                              data={edit.content}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                editForm.setFieldsValue({ content: data });
                              }}
                            /> */}
                            <CKEditor
                              // editor={ClassicEditor}
                              data={edit.content}
                              editor={ClassicExtended}
                              config={{
                                toolbar: [
                                  'heading',
                                  'alignment',
                                  '|',
                                  'numberedList',

                                  'fontFamily',
                                  'undo',
                                  'redo',
                                  'fontSize',
                                  'fontColor',
                                  'fontBackgroundColor',
                                  'bold',
                                  'underline',
                                  'strikethrough',
                                  'italic',
                                  'link',
                                  'bulletedList',
                                  'subscript',
                                  'superscript',
                                  'Image',
                                  'ImageCaption',
                                  'ImageStyle',
                                  'ImageToolbar',
                                  'ImageUpload',
                                  'ImageResizeHandles',
                                  'ImageResizeEditing',
                                  'ImageResize',
                                ],
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData()
                                form.setFieldsValue({ content: data })
                              }}
                            />
                            {/* <RichTextEditor
               value={edit.content}
         onChange={(event, editor) => {
          const data = editor.getData();
          editForm.setFieldsValue({ content: data });
        }}
      /> */}
                          </Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="d-flex justify-content-end">
                          <Button
                            loading={isLoading}
                            htmlType="submit"
                            type="primary"
                            className="btnPrimary"
                          >
                            Update Post
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                )}
              </Row>
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
              <Row className="mb-2">
                <Col className="center">
                  <h4>Create New Blog Post</h4>
                </Col>
              </Row>
              <Form
                onFinish={handleSubmit}
                form={form}
                layout="vertical"
                className=""
                size="large"
              >
                <Row>
                  <Col md={6}>
                    <Item
                      label="Title"
                      name="title"
                      rules={[{ message: 'Required Field', required: true }]}
                    >
                      <Input type="text" />
                    </Item>
                  </Col>
                  <Col md={6}>
                    <Item
                      label="Post By"
                      name="postBy"
                      rules={[{ message: 'Required Field', required: true }]}
                    >
                      <Input type="text" />
                    </Item>
                  </Col>
                </Row>
                <Col md={6}>
                  <Item
                    label="Image"
                    name="image"
                    rules={[{ message: 'Required Field', required: true }]}
                  >
                    <Upload
                      listType="picture"
                      maxCount={1}
                      accept=".png,.jpeg,.jpg"
                      customRequest={dummyRequest}
                    >
                      <Button>Browse</Button>
                    </Upload>
                  </Item>
                </Col>
                <Row className="mb-5">
                  <Col>
                    <Item
                      label="Content"
                      name="content"
                      rules={[{ message: 'Required Field', required: true }]}
                    >
                      <CKEditor
                        // editor={ClassicEditor}
                        data={'Start Typing'}
                        editor={ClassicExtended}
                        config={{
                          toolbar: [
                            'heading',
                            'alignment',
                            '|',
                            'numberedList',

                            'fontFamily',
                            'undo',
                            'redo',
                            'fontSize',
                            'fontColor',
                            'fontBackgroundColor',
                            'bold',
                            'underline',
                            'strikethrough',
                            'italic',
                            'link',
                            'bulletedList',
                            'subscript',
                            'superscript',
                            'Image',
                            'ImageCaption',
                            'ImageStyle',
                            'ImageToolbar',
                            'ImageUpload',
                            'ImageResizeHandles',
                            'ImageResizeEditing',
                            'ImageResize',
                          ],
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData()
                          form.setFieldsValue({ content: data })
                        }}
                      />
                      {/* <Editor /> */}
                      {/* <JoditEditor
            	ref={editor}
              url={enabled}
                value={content}
                config={config} */}
                      {/* tabIndex={1} // tabIndex of textarea
		// onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => {}}
            /> */}
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-end">
                    <Button
                      loading={isLoading}
                      htmlType="submit"
                      type="primary"
                      className="btnPrimary"
                    >
                      Submit Post
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </Container>
      <BackTop>
        <div style={backToTop}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </BackTop>
    </>
  )
}

export default BlogPosts
