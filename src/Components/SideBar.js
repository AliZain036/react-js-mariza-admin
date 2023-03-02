import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu } from 'antd'
import { routes } from '../routes'
import { useSelector, useDispatch } from 'react-redux'
import { animated, useSpring } from 'react-spring'
import Logo from '../assets/mariza-logo.png'
import { setSidebarKey } from '../Redux/Actions/sidebarKey'

const navItem = {
  color: '#57636F',
  fontSize: '13px',
  fontWeight: 400,
}

const SideBar = ({ collapsedWidth }) => {
  const dispatch = useDispatch()
  const [filterRoutes, setFilterRoutes] = useState([])
  const role = useSelector((state) => state.user.role)
  const key = useSelector((state) => state.key)
  const fade = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: {
      duration: 500,
    },
  })

  useEffect(() => {
    let arr = []
    if (role !== 'super') {
      arr = routes.filter((item) => item.layout !== 'super')
    } else {
      arr = routes
    }
    arr = arr.filter((item) => item.sidebar)
    setFilterRoutes(arr)
  }, [role])

  const handleSelectKey = (value) => {
    dispatch(setSidebarKey(value.key))
  }

  return (
    <Menu
      mode="inline"
      selectedKeys={key}
      style={{ maxHeight: '100%', height: '100%' }}
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: '70px' }}
      >
        <Link to="/" className="logoTitle">
          {collapsedWidth === 230 ? (
            <animated.span style={fade}>
              <img src={Logo} alt="" className="w-100" />
              {/* <i class="fab fa-gofore"></i>ift Me That */}
            </animated.span>
          ) : (
            <animated.span style={{ fontSize: '34px', ...fade }}>
              <img src={Logo} alt="" className="w-100" />
              {/* <i class="fab fa-gofore"></i> */}
            </animated.span>
          )}
        </Link>
      </div>
      <hr
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: '#57636F',
          marginTop: '88px',
        }}
      />
      {filterRoutes.map((route) => {
        return (
          <Menu.Item
            onClick={handleSelectKey}
            style={navItem}
            icon={route.icon()}
            key={route.path}
          >
            <NavLink
              // activeClassName="text-white bg-danger"
              className="h-100 w-100"
              style={navItem}
              to={route.path}
            >
              {route.name}
            </NavLink>
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

export default SideBar
