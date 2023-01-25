import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Form, Input, Button, Card, message, notification } from 'antd'
import { LoginOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../Redux/Actions'
import { useSpring, animated } from 'react-spring'
import { firebase } from '../Firebase/config'
import { fetchUsers } from '../Redux/Actions/users'
import { fetchProducts } from '../Redux/Actions/products'
import Logo from '../assets/mariza-logo.png'

const { Item } = Form

const defaultStyle = {
  borderRadius: '10px',
}

const Login = () => {
  //state
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  const fade = useSpring({
    from: {
      // opacity: 0,
      transform: 'translate3d(0,-100%,0)',
    },
    to: {
      // opacity: 1,
      transform: 'translate3d(0,0,0)',
    },
  })

  useEffect(() => {
    checkUser() // if user exists, user cannot access login page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkUser = () => {
    if (user) {
      history.push('/statistics')
    }
  }

  const handleLogin = async (values) => {
    setLoading(true)
    const { email, password } = values
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        const id = user.user.uid
        dispatch(userLogin(id, 'admin'))
        dispatch(fetchUsers()) // fetching users
        dispatch(fetchProducts()) // fetching products
        history.push('/statistics')
        notification.success({
          message: 'Logged in!',
          key: 'logged_in',
          style: {
            borderRadius: '15px',
          },
        })
      })
      .catch((error) => {
        message.error({
          content: 'Invalid Email or Password!',
          key: 'login_failed',
        })
      })
    setLoading(false)
  }

  return (
    <animated.div style={fade}>
      <Container className="authPage" fluid>
        <Row
          className="d-flex justify-content-center align-content-center"
          style={{ height: '100vh' }}
        >
          <Col md={4}>
            <Card style={defaultStyle}>
              <Form onFinish={handleLogin} layout="vertical">
                <Row>
                  <Col className="text-center">
                    <img src={Logo} alt="" className="w-75 py-2" />
                  </Col>
                </Row>
                <Row className="">
                  <Col>
                    <Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please input username!' },
                      ]}
                      className="fw-bold"
                    >
                      <Input
                        className="loginForm"
                        size="large"
                        type="email"
                        placeholder="email"
                      />
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please input password!' },
                      ]}
                      className="fw-bold"
                    >
                      <Input.Password
                        className="loginForm"
                        size="large"
                        placeholder="password"
                      />
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      shape="round"
                      icon={<LoginOutlined />}
                      className="btnLogin"
                      loading={loading}
                      size="large"
                      block
                      type="primary"
                      htmlType="submit"
                    >
                      Login
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </animated.div>
  )
}

export default Login
