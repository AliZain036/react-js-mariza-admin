import { Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Header from './Components/Header'
import SideBar from './Components/SideBar'
import Login from './Pages/Login'
import { routes } from './routes'

const { Sider, Content, Footer } = Layout

const App = () => {
  const location = useLocation()
  const history = useHistory()
  const user = useSelector((state) => state.user.user)
  const role = useSelector((state) => state.user.role)
  const [filterRoutes, setFilterRoutes] = useState([])
  const [collapsedWidth, setCollapsedWidth] = useState(230)
  const fade = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  })

  useEffect(() => {
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // filtering routes
  useEffect(() => {
    let arr = []
    if (role !== 'super') {
      arr = routes.filter((item) => item.layout !== 'super')
    } else {
      arr = routes
    }
    setFilterRoutes(arr)
  }, [role])

  const checkUser = () => {
    if (!user) {
      history.push('/auth/login')
    }
  }

  const handleWidth = (val) => {
    if (val) {
      setCollapsedWidth(80)
    } else {
      setCollapsedWidth(230)
    }
  }

  return (
    <animated.div style={fade}>
      <Route exact path="/auth/login" component={Login} />
      {user && (
        <Layout>
          <Sider
            breakpoint="md"
            theme="light"
            collapsedWidth={80}
            width={collapsedWidth}
            onCollapse={handleWidth}
            collapsible
            className="scroll"
            style={{
              overflow: 'auto',
              maxHeight: '100vh',
              position: 'fixed',
              left: 0,
              zIndex: 900,
            }}
          >
            <SideBar collapsedWidth={collapsedWidth} />
          </Sider>
          <Layout style={{ marginLeft: collapsedWidth }}>
            <Content style={{ minHeight: '100vh', overflowX: 'hidden' }}>
              <Header render={false} />
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  classNames="my-node"
                  timeout={250}
                >
                  <Switch>
                    {filterRoutes.map((item) => {
                      return (
                        <Route path={item.path} component={item.component} />
                      )
                    })}
                    {/* <Redirect to="/not-found" /> */}
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </Content>
            <Footer
              style={{
                textAlign: 'center',
                borderTop: '1px solid #F4F5F7',
                backgroundColor: '#e5e5e5',
              }}
              className="text-dark fw-bold"
            >
              MARIZA
            </Footer>
          </Layout>
        </Layout>
      )}
    </animated.div>
  )
}

export default App
