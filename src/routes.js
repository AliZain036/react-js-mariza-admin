import Users from './Pages/Users'
import Products from './Pages/Products'
import Games from './Pages/Games'
import Privacy from './Pages/Privacy'
import Stats from './Pages/Stats'
import Categories from './Pages/Categories'
import ManageAdmins from './Pages/ManageAdmins'
import BlogPosts from './Pages/BlogPosts'
import Occasion from './Pages/Occasion'
import Interests from './Pages/Interests'
import Recipient from './Pages/Recepient'
import TermsConditions from './Pages/TermsConditions.jsx'
import DMCA from './Pages/DMCAPolicy.jsx'
import Affiliate from './Pages/AffiliateDisclosure.jsx'
import Banners from './Pages/Banners'
import Error from './Pages/Error'

import {
  UserOutlined,
  UsergroupAddOutlined,
  BarsOutlined,
  ShopOutlined,
  FileProtectOutlined,
  BarChartOutlined,
  FormOutlined,
  DingtalkOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import DontSellmyInfo from './Pages/DontSellmyInfo'
import Brands from './Pages/Brands'
import ClothTypes from './Pages/ClothTypes'
import SizeChart from './Pages/SizeChart'
import Orders from './Pages/Orders'
import SpecialOffer from './Pages/SpecialOffer'

export const routes = [
  // {
  //   path: '/statistics',
  //   name: 'Statistics',
  //   icon: () => <BarChartOutlined />,
  //   component: Stats,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  // {
  //   path: '/users',
  //   name: 'Users',
  //   icon: () => <UserOutlined />,
  //   component: Users,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  {
    path: '/brands',
    name: 'Brands',
    icon: () => <UserOutlined />,
    component: Brands,
    layout: 'admin',
    sidebar: true,
  },
  {
    path: '/banners-images',
    name: 'Banners',
    icon: () => <PictureOutlined />,
    component: Banners,
    layout: 'admin',
    sidebar: true,
  },
  {
    path: '/products',
    name: 'Products',
    icon: () => <ShopOutlined />,
    component: Products,
    layout: 'admin',
    sidebar: true,
  },
  {
    path: '/size-chart',
    name: 'Size Chart',
    icon: () => <ShopOutlined />,
    component: SizeChart,
    layout: 'admin',
    sidebar: true,
  },
  {
    path: '/orders',
    name: 'Orders',
    icon: () => <ShopOutlined />,
    component: Orders,
    layout: 'admin',
    sidebar: true,
  },
  // {
  //   path: '/blog-posts',
  //   name: 'Blog Posts',
  //   icon: () => <FormOutlined />,
  //   component: BlogPosts,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  {
    path: '/categories',
    name: 'Categories',
    icon: () => <BarsOutlined />,
    component: Categories,
    layout: 'admin',
    sidebar: true,
  },
  {
    path: '/cloth-types',
    name: 'Cloth Types',
    icon: () => <BarsOutlined />,
    component: ClothTypes,
    layout: 'admin',
    sidebar: true,
  },
  {
    path: '/special-offer',
    name: 'Special Offer',
    icon: () => <BarsOutlined />,
    component: SpecialOffer,
    layout: 'admin',
    sidebar: true,
  },
  // {
  //   path: '/occasions',
  //   name: 'Occasions',
  //   icon: () => <BarsOutlined />,
  //   component: Occasion,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  // {
  //   path: '/interests',
  //   name: 'Interests',
  //   icon: () => <BarsOutlined />,
  //   component: Interests,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  // {
  //   path: '/recipients',
  //   name: 'Recipients',
  //   icon: () => <BarsOutlined />,
  //   component: Recipient,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  // {
  //   path: '/games',
  //   name: 'Giveaway Games',
  //   icon: () => <DingtalkOutlined />,
  //   component: Games,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  {
    path: '/privacy',
    name: 'Privacy Policy',
    icon: () => <FileProtectOutlined />,
    component: Privacy,
    layout: 'admin',
    sidebar: true,
  },
  {
    path: '/terms-conditions',
    name: 'Terms & Conditions',
    icon: () => <FileProtectOutlined />,
    component: TermsConditions,
    layout: 'admin',
    sidebar: true,
  },
  // {
  //   path: '/dmca-policy',
  //   name: 'DMCA Policy',
  //   icon: () => <FileProtectOutlined />,
  //   component: DMCA,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  // {
  //   path: '/affiliate-disclosure',
  //   name: 'Affiliate Disclosure',
  //   icon: () => <FileProtectOutlined />,
  //   component: Affiliate,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  // {
  //   path: '/do_not_sell_my_information',
  //   name: 'Do Not sell My Info',
  //   icon: () => <FileProtectOutlined />,
  //   component: DontSellmyInfo,
  //   layout: 'admin',
  //   sidebar: true,
  // },
  {
    path: '/not-found',
    name: 'Error',
    icon: () => <FileProtectOutlined />,
    component: Error,
    layout: 'admin',
    sidebar: false,
  },
  {
    path: '/',
    name: 'Products',
    icon: () => <UserOutlined />,
    component: Products,
    layout: 'admin',
    sidebar: false,
  },
]
