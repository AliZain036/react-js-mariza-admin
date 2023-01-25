import React, { useEffect, useState } from "react";
import { firebase } from "../Firebase/config";
import { Container, Row, Col } from "react-bootstrap";
import { Divider, Card, Statistic, Tag } from "antd";
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
} from "recharts";
import {
  UserOutlined,
  DollarOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipients } from "../Redux/Actions/recipients";
import { fetchInterests } from "../Redux/Actions/interest";
import { fetchOccasions } from "../Redux/Actions/occasions";
import { fetchCategories } from "../Redux/Actions/categories";
import { fetchUsers } from "../Redux/Actions/users";
import { fetchProducts } from "../Redux/Actions/products";

const barColors = [
  "#126881",
  "#ff7f0e",
  "#2ca02c",
  "#FC5929",
  "#B42B51",
  "#FFB419",
];

const Stats = () => {
  //state
  const [posts, setPosts] = useState(null);
  const [chartData, setChartData] = useState([]);

  // redux
  const dispatch = useDispatch();
  const recipientsRedux = useSelector((state) => state.recipients);
  const interestsRedux = useSelector((state) => state.interests);
  const occasionsRedux = useSelector((state) => state.occasions);
  const allUsersRedux = useSelector((state) => state.users);
  const categoriesRedux = useSelector((state) => state.categories);
  const productsRedux = useSelector((state) => state.products);

  useEffect(() => {
    getBlogPosts();
  }, []);

  useEffect(() => {
    if (allUsersRedux.isLoading) {
      dispatch(fetchUsers());
    }
    if (productsRedux.isLoading) {
      dispatch(fetchProducts());
    }
    if (categoriesRedux.isLoading) {
      dispatch(fetchCategories());
    }
    if (occasionsRedux.isLoading) {
      dispatch(fetchOccasions());
    }
    if (interestsRedux.isLoading) {
      dispatch(fetchInterests());
    }
    if (recipientsRedux.isLoading) {
      dispatch(fetchRecipients());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let users = {
      name: "Users",
      total: allUsersRedux.users.length,
    };
    let products = {
      name: "Products",
      total: productsRedux.products.length,
    };
    let categories = {
      name: "Categories",
      total: categoriesRedux.categories.length,
    };
    let occasions = {
      name: "Occasions",
      total: occasionsRedux.occasions.length,
    };
    let recipients = {
      name: "Recipients",
      total: recipientsRedux.recipients.length,
    };
    let interests = {
      name: "Interests",
      total: interestsRedux.interests.length,
    };
    let arr = [users, products, categories, occasions, recipients, interests];
    setChartData(arr);
  }, [
    allUsersRedux,
    productsRedux,
    recipientsRedux,
    interestsRedux,
    occasionsRedux,
    categoriesRedux,
  ]);

  const getBlogPosts = async () => {
    try {
      let res = await firebase.firestore().collection("blogPosts").get();
      let arr = [];
      res.forEach((doc) => arr.push(doc.data()));
      setPosts(arr);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container style={{ minHeight: "100vh" }}>
        <Divider orientation="left">
          <h3>Statistics</h3>
        </Divider>
        <Row>
          <Col className="mb-2 m-md-0" md={3}>
            <Card className="cardStats">
              <Statistic
                title="Total Users"
                value={allUsersRedux.users.length}
                valueStyle={{ color: "#3f8600" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col className="mb-2 m-md-0" md={3}>
            <Card className="cardStats">
              <Statistic
                title="Total Products"
                value={productsRedux.products.length}
                prefix={<ShopOutlined />}
                valueStyle={{ color: "#FBBA32" }}
              />
            </Card>
          </Col>
          <Col className="mb-2 m-md-0" md={3}>
            <Card className="cardStats">
              <Statistic
                title="Total Categories"
                value={categoriesRedux.categories.length}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: "#E41A4A" }}
              />
            </Card>
          </Col>
          <Col className="mb-2 m-md-0" md={3}>
            <Card className="cardStats">
              <Statistic
                title="Total Posts"
                value={posts?.length ?? ""}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#FFA771" }}
              />
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row>
          {chartData.length > 0 && (
            <Col xs={12} lg={7}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="total"
                    name="Total"
                    fill="#126881"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={barColors[index % 20]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Col>
          )}
        </Row>
        <Row>
          <Col lg={6}>
            <Divider orientation="left">
              <Tag
                style={{ fontSize: "16px" }}
                className="p-2 rounded-pill"
                color="blue"
              >
                Products Analytics
              </Tag>
            </Divider>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={productsRedux.products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.saved"
                  stroke="#8884d8"
                  name="Saved"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.liked"
                  stroke="#82ca9d"
                  name="Liked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.shared"
                  stroke="#FFB319"
                  name="Shared"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.clicked"
                  stroke="#38A3A5"
                  name="Clicked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.won"
                  stroke="#FF4C29"
                  name="Won"
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col lg={6}>
            <Divider orientation="left">
              <Tag
                style={{ fontSize: "16px" }}
                className="p-2 rounded-pill"
                color="blue"
              >
                Categories Analytics
              </Tag>
            </Divider>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={categoriesRedux.categories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.saved"
                  stroke="#8884d8"
                  name="Saved"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.liked"
                  stroke="#82ca9d"
                  name="Liked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.shared"
                  stroke="#FFB319"
                  name="Shared"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.clicked"
                  stroke="#38A3A5"
                  name="Clicked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.won"
                  stroke="#FF4C29"
                  name="Won"
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Divider orientation="left">
              <Tag
                style={{ fontSize: "16px" }}
                className="p-2 rounded-pill"
                color="blue"
              >
                Occasions Analytics
              </Tag>
            </Divider>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={occasionsRedux.occasions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.saved"
                  stroke="#8884d8"
                  name="Saved"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.liked"
                  stroke="#82ca9d"
                  name="Liked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.shared"
                  stroke="#FFB319"
                  name="Shared"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.clicked"
                  stroke="#38A3A5"
                  name="Clicked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.won"
                  stroke="#FF4C29"
                  name="Won"
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col lg={6}>
            <Divider orientation="left">
              <Tag
                style={{ fontSize: "16px" }}
                className="p-2 rounded-pill"
                color="blue"
              >
                Interests Analytics
              </Tag>
            </Divider>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={interestsRedux.interests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.saved"
                  stroke="#8884d8"
                  name="Saved"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.liked"
                  stroke="#82ca9d"
                  name="Liked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.shared"
                  stroke="#FFB319"
                  name="Shared"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.clicked"
                  stroke="#38A3A5"
                  name="Clicked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.won"
                  stroke="#FF4C29"
                  name="Won"
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Divider orientation="left">
              <Tag
                style={{ fontSize: "16px" }}
                className="p-2 rounded-pill"
                color="blue"
              >
                Recipients Analytics
              </Tag>
            </Divider>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={recipientsRedux.recipients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.saved"
                  stroke="#8884d8"
                  name="Saved"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.liked"
                  stroke="#82ca9d"
                  name="Liked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.shared"
                  stroke="#FFB319"
                  name="Shared"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.clicked"
                  stroke="#38A3A5"
                  name="Clicked"
                />
                <Line
                  strokeWidth={2}
                  type="monotone"
                  dataKey="stats.won"
                  stroke="#FF4C29"
                  name="Won"
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Stats;
