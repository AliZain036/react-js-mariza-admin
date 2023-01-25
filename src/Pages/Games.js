/* eslint-disable array-callback-return */
import { DeleteOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import { cloneDeep, map } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { firebase } from "../Firebase/config";
import { singleImageUpload } from "../Firebase/utils";
import { fetchUsers } from "../Redux/Actions/users";
import { useDispatch } from "react-redux";

const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;

const Games = () => {
  //state
  const [questionsArray, setQuestionsArray] = useState([]);
  const [createGame, setCreateGame] = useState(false);
  const [wishlistArray, setWishlistArray] = useState(null);
  const users = useSelector((state) => state.users.users);
  const products = useSelector((state) => state.products.products);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [allGames, setAllGames] = useState([]);
  const [search, setSearch] = useState([]);
  const [edit, setEdit] = useState(null);
  const [activeKey, setActiveKey] = useState("1");
  const [selectedUser, setSelectedUser] = useState(null);
  const [show, setShow] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span>...{id.substr(id.length - 5)}</span>,
    },
    {
      title: "Picture",
      dataIndex: "image",
      key: "image",
      render: (image, item) => (
        <div className="d-flex justify-content-center">


          <Image src={image} alt="game" height="50px" width="50px" />

        </div>
      ),
    },
    {
      title: "Giveaway Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Posted / Ends ",
      dataIndex: "postedOn",
      key: "name",
      render: (postedOn, item) => (
        <div>
          <p>Posted: {postedOn} </p>
          <p>Ends: {item.endTime} </p>
        </div>
      ),
    },
    {
      title: "User Name",
      dataIndex: ["user", "name"],
      key: "user",
    },
    {
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (questions) =>
        questions.map((item) => (
          <Tooltip
            title={
              <div>
                <div>
                  <span>Correct Product: </span>
                  <span className="text-success">
                    {item.correctProduct.name}
                  </span>
                </div>
                <div>
                  <span>Wrong Product: </span>
                  <span className="text-danger">{item.wrongProduct.name}</span>
                </div>
              </div>
            }
          >
            <Tag color="green" className="rounded-pill">
              {item.question}
            </Tag>
          </Tooltip>
        )),
    },
    // {
    //   title: "Product",
    //   dataIndex: "questions",
    //   key: "product",
    //   render: (questions) =>
    //     questions.map((item) =>
    //       item.products.map((i) => <Tag color="green">{i.name}</Tag>)
    //     ),
    // },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (id, item) => (
        <div className="d-flex">
          <Tooltip title={`Edit ${item.name}`}>
            <Button
              onClick={() => handleEdit(item)}
              className="btnSecondary me-1"
              type="primary"
              loading={btnLoading}
            >
              <i className="fa fa-edit"></i>
            </Button>
          </Tooltip>
          <Tooltip title={`Delete ${item.name}`}>
            <Button
              onClick={() => handleDelete(id)}
              className="btnDanger"
              type="primary"
              loading={btnLoading}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const dispatch = useDispatch();

  // animation
  const slide = useSpring({
    from: {
      // opacity: 0,
      transform: "translate3d(0,-100%,0)",
    },
    to: {
      // opacity: 1,
      transform: "translate3d(0,0,0)",
    },
  });

  useEffect(() => {
    getGames();
    dispatch(fetchUsers());

  }, []);

  // get giveaways
  const getGames = async () => {
    setIsLoading(true);
    await firebase
      .firestore()
      .collection("giveaways")
      .get()
      .then((allDocs) => {
        let arr = [];
        allDocs.forEach((doc) => {
          let obj = doc.data();
          obj.id = doc.id;
          arr.push(obj);
        });
        setAllGames(arr);
        setSearch(arr);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  // search
  const handleSearch = (value) => {
    value = value.trim().toLowerCase();
    let arr = cloneDeep(allGames);
    arr = arr.filter((item) => item.name.trim().toLowerCase().includes(value));
    setSearch(arr);
  };
  const handleRemoveImage = () => {
    console.log();
    // let arr = cloneDeep(edit.image);
    // arr = arr?.filter((item, indx) => idx !== indx);
    setEdit({
      ...edit,
      image: edit.image,
    });
  };
  // add giveaway
  const handleSubmit = async (values) => {
    setBtnLoading(true);
    const link = await singleImageUpload(
      "games",
      values.image.file.originFileObj
    );
    let obj = {
      name: values.name,
      user: selectedUser,
      questions: questionsArray,
      customLink: values.customLink,
      endTime: moment(values.endTime).format("YYYY-MM-DD hh:mm A"),
      giveawayTerms: values.giveawayTerms,
      prize: values.prize,
      wishlistTitle: values.wishlistTitle,
      postedOn: moment().format("YYYY-MM-DD hh:mm A"),
      image: link,
      totalParticipants: values.totalParticipants,
    };
    await firebase
      .firestore()
      .collection("giveaways")
      .add(obj)
      .then(async (doc) => {
        message.success("Game Added!");
        await getGames();
        handleBack();
      });
    setBtnLoading(false);
  };

  const handleModalClose = () => {
    // form.resetFields();
    setBtnLoading(false);
    setShow(false);
  };

  // delete giveaway
  const handleDelete = async (id) => {
    setBtnLoading(true);
    await firebase
      .firestore()
      .collection("giveaways")
      .doc(id)
      .delete()
      .then(() => {
        message.success("Game Deleted!");
        getGames();
      })
      .catch((err) => console.log(err));
    setBtnLoading(false);
  };

  // // edit giveaway
  const handleEdit = (item) => {
    console.log(item, "clicked item")
    setEdit(item);
    setActiveKey("2");
    Object.entries(item)?.map(([key, value]) => {
      if (key === "product") {
        editForm.setFieldsValue({
          [key]: value.id,
        });
        return;
      }
      if (key === "user") {
        editForm?.setFieldsValue({
          [key]: value?.id,
        });
        return;
      }
      editForm.setFieldsValue({
        [key]: value,
      });
    });
  };

  const handleEditGiveaway = async (values) => {
    // find user
    console.log(values, "obj values")
    if (values.image !== edit.image) {
      values.image = values?.image?.file?.originFileObj;
      const url = await singleImageUpload("games", values.image);
      values.image = url;
    } else {
      values.image = edit.image;
    }


    values.user = selectedUser;
    values.questions = questionsArray;

    console.log(values, "obj")
    setBtnLoading(true);
    await firebase
      .firestore()
      .collection("giveaways")
      .doc(edit.id)
      .set(values, { merge: true })
      .then(() => {
        message.success(`${edit.name} updated successfully`);
        handleBack();
        getGames();
      })
      .catch((err) => console.log(err));
    setBtnLoading(false);
  };

  const handleBack = () => {
    setActiveKey("1");
    editForm.resetFields();
    setBtnLoading(false);
    form.resetFields();
    setSelectedUser(null);
    setCreateGame(false);
    setSelectedUser(null);
    setWishlistArray(null);
    setQuestionsArray([]);
  };

  const handleSelectedUser = (val) => {
    let obj = users.find((item) => item.id === val);
    setSelectedUser(obj);
  };

  const handleSelectWishList = (type, list) => {
    setWishlistArray({
      type,
      list,
    });
    setCreateGame(false);
  };

  const handleGame = () => {
    setCreateGame(true);
  };

  const handleProductAdd = (value) => {
    let obj = products.find((item) => item.id === value);
    let arr = cloneDeep(wishlistArray.list);
    arr.push(obj);
    setWishlistArray({
      ...wishlistArray,
      list: arr,
    });
  };

  const handleProductRemove = (value) => {
    let arr = wishlistArray.list.filter((item) => item.id !== value);

    setWishlistArray({
      ...wishlistArray,
      list: arr,
    });
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleModalSubmit = (values) => {
    values.correctProduct = wishlistArray.list.find(
      (item) => item.id === values.correctProduct
    );
    values.wrongProduct = wishlistArray.list.find(
      (item) => item.id === values.wrongProduct
    );
    // let arr = questionsArray;
    // arr.push(values);
    questionsArray.push(values);
    // setQuestionsArray(arr);
    notification.success({
      message: "Question Added!",
    });
    modalForm.resetFields();
  };

  return (
    <>
      <Container style={{ minHeight: "100vh" }}>
        <Tabs activeKey={activeKey} animated defaultActiveKey="1">
          <TabPane key="1">
            <Row className="mb-2">
              <Col>
                <Button
                  loading={isLoading}
                  onClick={() => setActiveKey("3")}
                  className="btnPrimary"
                  type="primary"
                  size="large"
                >
                  + Create Game
                </Button>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="d-flex justify-content-center">
                <Tag
                  className="my-2 rounded-pill font18 px-3 py-2"
                  color="blue"
                >
                  Total Games: {search ? search.length : 0}
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
            <Row>
              <Col>
                <Table
                  bordered
                  dataSource={search}
                  columns={columns}
                  pagination={{
                    position: ["bottomCenter"],
                  }}
                  scroll={{ x: true }}
                  loading={isLoading}
                />
              </Col>
            </Row>
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
                    <i className="fa fa-arrow-left me-1"> </i>Back
                  </Button>
                </Col>
              </Row>
              <Row>
                {edit && (
                  <Row>
                    <Col>
                      <h4 className="text-center">Edit {edit.name}</h4>
                      <Form
                        layout="vertical"
                        onFinish={handleEditGiveaway}
                        form={editForm}
                        size="large"
                        className="fw-bold"
                      >
                        <Row>
                          <Col md={4}>
                            <Item
                              label="Game Name"
                              name="name"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Input type="text" />
                            </Item>
                          </Col>
                          <Col md={4}>
                            <Item
                              label="Prize"
                              name="prize"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Select placeholder="Select prize">
                                {products.map((item) => (
                                  <Option value={item.id}>
                                    <div>
                                      <Avatar
                                        src={item.image}
                                        shape="square"
                                        className="me-2"
                                      />
                                      {item.name}
                                    </div>
                                  </Option>
                                ))}
                              </Select>
                            </Item>
                          </Col>
                          <Col md={4}>
                            <Item
                              label="Total Participants"
                              name="totalParticipants"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Input type="number" min={1} />
                            </Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <Item
                              label="Wishlist Title"
                              name="wishlistTitle"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Input type="text" />
                            </Item>
                          </Col>
                          <Col md={4}>
                            <Item
                              label="Custom Link"
                              name="customLink"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Input type="text" />
                            </Item>
                          </Col>
                          {/* <Col md={4}>
                            <Item
                              label="Ends On"
                              name="endTime"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <DatePicker
                                showTime
                                style={{ width: "100%", borderRadius: "40px" }}
                                placeholder="Select date / time"
                                showSecond={false}
                              />
                            </Item>
                          </Col> */}

                        </Row>
                        <Row>
                          <Col md={6}>
                            <Item
                              label="Image"
                              name="image"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Upload
                                accept=".jpg,.png,.jpeg"
                                customRequest={dummyRequest}
                                maxCount={1}
                                listType="picture"
                              >
                                <Button>Browse</Button>
                              </Upload>
                            </Item>
                          </Col>
                          <Col md={6}>
                            <Item
                              label="Giveaway Terms"
                              name="giveawayTerms"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Input.TextArea rows={4} />
                            </Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Item
                              name="user"
                              label="For User"
                              rules={[{ message: "Required Field!", required: true }]}
                            >
                              <Select
                                showSearch
                                optionFilterProp="children"
                                onSelect={handleSelectedUser}
                                filterOption={(input, option) =>
                                  option?.children
                                    ?.toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="Type to Search"
                              >
                                {users.map((item) => (
                                  <Option value={item.id}>{item.name}</Option>
                                ))}
                              </Select>
                            </Item>
                          </Col>
                          <Col md={6}>
                            {createGame && (
                              <animated.div style={slide}>
                                <Item
                                  name="product"
                                  label="Add Products and Create Game"
                                  rules={[{ message: "Required Field!", required: true }]}
                                >
                                  <Select
                                    onSelect={handleProductAdd}
                                    onDeselect={handleProductRemove}
                                    mode="multiple"
                                    placeholder="Type to Search"
                                  >
                                    {products.map((item) => (
                                      <Option value={item.id}>
                                        <div>
                                          <Avatar
                                            src={item.image}
                                            shape="square"
                                            className="me-2"
                                          />
                                          {item.name}
                                        </div>
                                      </Option>
                                    ))}
                                  </Select>
                                </Item>
                              </animated.div>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {selectedUser && (
                              <div>
                                <div>
                                  <strong>User: </strong>
                                  <span className="fw-normal">{selectedUser.name}</span>
                                </div>
                                <span
                                  onClick={() =>
                                    handleSelectWishList(
                                      "Private",
                                      selectedUser.wishlist.private
                                    )
                                  }
                                  style={{ cursor: "pointer", marginTop: 10 }}
                                  className="mt-3"
                                >
                                  <strong>Select Private Wishlist: </strong>
                                  <span className="fw-normal">
                                    <Tag color="green">
                                      {selectedUser.wishlist.private.length} items
                                    </Tag>
                                  </span>
                                </span>
                                <span
                                  onClick={() =>
                                    handleSelectWishList(
                                      "Public",
                                      selectedUser.wishlist.public
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <strong>Select Public Wishlist: </strong>
                                  <span className="fw-normal">
                                    <Tag color="green">
                                      {selectedUser.wishlist.public.length} items
                                    </Tag>
                                  </span>
                                </span>
                                {wishlistArray && (
                                  <>
                                    <div className="mt-4">
                                      <Divider className="d-flex" orientation="left">
                                        <span className="d-flex">
                                          {wishlistArray.type}{" "}
                                          <span className="ms-3">
                                            <Button
                                              onClick={handleGame}
                                              size="small"
                                              type="primary"
                                            >
                                              Add Product
                                            </Button>
                                          </span>
                                        </span>
                                      </Divider>
                                      {wishlistArray.list.map((item) => (
                                        <Tag className="px-2 py-1 rounded" color="blue">
                                          {item.name}
                                        </Tag>
                                      ))}
                                    </div>
                                    <div className="mt-4">
                                      <Button
                                        onClick={() => setShow(true)}
                                        type="primary"
                                        size="small"
                                      >
                                        Create Game
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <h5>Added Questions</h5>
                          <Col>
                            {questionsArray.map((item) => (
                              <Tooltip
                                title={
                                  <div>
                                    <div>
                                      <span>Correct Product: </span>
                                      <span className="text-success">
                                        {item.correctProduct.name}
                                      </span>
                                    </div>
                                    <div>
                                      <span>Wrong Product: </span>
                                      <span className="text-danger">
                                        {item.wrongProduct.name}
                                      </span>
                                    </div>
                                  </div>
                                }
                              >
                                <Tag
                                  className="rounded-pill px-2 py-1"
                                  style={{ fontSize: 15 }}
                                  color="green"
                                >
                                  {item.question}
                                </Tag>
                              </Tooltip>
                            ))}
                          </Col>
                        </Row>

                        <Row>
                          <Col className="d-flex justify-content-end">
                            <Button
                              type="primary"
                              className="btnPrimary"
                              htmlType="submit"
                              loading={btnLoading}
                            >
                              Update Giveaway
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                )}
              </Row>
            </Card>
          </TabPane>
          <TabPane key="3">
            <Form
              form={form}
              onFinish={handleSubmit}
              size="large"
              className="fw-bold"
              layout="vertical"
            >
              <Row className="mb-2">
                <Col>
                  <Button
                    onClick={handleBack}
                    className="btnSecondary"
                    type="primary"
                  >
                    <i className="fa fa-arrow-left me-1"> </i>Back
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Item
                    label="Game Name"
                    name="name"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Input type="text" />
                  </Item>
                </Col>
                <Col md={4}>
                  <Item
                    label="Prize"
                    name="prize"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Select placeholder="Select prize">
                      {products.map((item) => (
                        <Option value={item.id}>
                          <div>
                            <Avatar
                              src={item.image}
                              shape="square"
                              className="me-2"
                            />
                            {item.name}
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col md={4}>
                  <Item
                    label="Total Participants"
                    name="totalParticipants"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Input type="number" min={1} />
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Item
                    label="Wishlist Title"
                    name="wishlistTitle"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Input type="text" />
                  </Item>
                </Col>
                <Col md={4}>
                  <Item
                    label="Custom Link"
                    name="customLink"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Input type="text" />
                  </Item>
                </Col>
                <Col md={4}>
                  <Item
                    label="Ends On"
                    name="endTime"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <DatePicker
                      showTime
                      style={{ width: "100%", borderRadius: "40px" }}
                      placeholder="Select date / time"
                      showSecond={false}
                    />
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Item
                    label="Image"
                    name="image"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Upload
                      accept=".jpg,.png,.jpeg"
                      customRequest={dummyRequest}
                      maxCount={1}
                      listType="picture"
                    >
                      <Button>Browse</Button>
                    </Upload>
                  </Item>
                </Col>
                <Col md={6}>
                  <Item
                    label="Giveaway Terms"
                    name="giveawayTerms"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Input.TextArea rows={4} />
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Item
                    name="user"
                    label="For User"
                    rules={[{ message: "Required Field!", required: true }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onSelect={handleSelectedUser}
                      filterOption={(input, option) =>
                        option?.children
                          ?.toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="Type to Search"
                    >
                      {users.map((item) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col md={6}>
                  {createGame && (
                    <animated.div style={slide}>
                      <Item
                        name="product"
                        label="Add Products and Create Game"
                        rules={[{ message: "Required Field!", required: true }]}
                      >
                        <Select
                          onSelect={handleProductAdd}
                          onDeselect={handleProductRemove}
                          mode="multiple"
                          placeholder="Type to Search"
                        >
                          {products.map((item) => (
                            <Option value={item.id}>
                              <div>
                                <Avatar
                                  src={item.image}
                                  shape="square"
                                  className="me-2"
                                />
                                {item.name}
                              </div>
                            </Option>
                          ))}
                        </Select>
                      </Item>
                    </animated.div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  {selectedUser && (
                    <div>
                      <div>
                        <strong>User: </strong>
                        <span className="fw-normal">{selectedUser.name}</span>
                      </div>
                      <span
                        onClick={() =>
                          handleSelectWishList(
                            "Private",
                            selectedUser.wishlist.private
                          )
                        }
                        style={{ cursor: "pointer", marginTop: 10 }}
                        className="mt-3"
                      >
                        <strong>Select Private Wishlist: </strong>
                        <span className="fw-normal">
                          <Tag color="green">
                            {selectedUser.wishlist.private.length} items
                          </Tag>
                        </span>
                      </span>
                      <span
                        onClick={() =>
                          handleSelectWishList(
                            "Public",
                            selectedUser.wishlist.public
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <strong>Select Public Wishlist: </strong>
                        <span className="fw-normal">
                          <Tag color="green">
                            {selectedUser.wishlist.public.length} items
                          </Tag>
                        </span>
                      </span>
                      {wishlistArray && (
                        <>
                          <div className="mt-4">
                            <Divider className="d-flex" orientation="left">
                              <span className="d-flex">
                                {wishlistArray.type}{" "}
                                <span className="ms-3">
                                  <Button
                                    onClick={handleGame}
                                    size="small"
                                    type="primary"
                                  >
                                    Add Product
                                  </Button>
                                </span>
                              </span>
                            </Divider>
                            {wishlistArray.list.map((item) => (
                              <Tag className="px-2 py-1 rounded" color="blue">
                                {item.name}
                              </Tag>
                            ))}
                          </div>
                          <div className="mt-4">
                            <Button
                              onClick={() => setShow(true)}
                              type="primary"
                              size="small"
                            >
                              Create Game
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
              <Row className="mt-3">
                <h5>Added Questions</h5>
                <Col>
                  {questionsArray.map((item) => (
                    <Tooltip
                      title={
                        <div>
                          <div>
                            <span>Correct Product: </span>
                            <span className="text-success">
                              {item.correctProduct.name}
                            </span>
                          </div>
                          <div>
                            <span>Wrong Product: </span>
                            <span className="text-danger">
                              {item.wrongProduct.name}
                            </span>
                          </div>
                        </div>
                      }
                    >
                      <Tag
                        className="rounded-pill px-2 py-1"
                        style={{ fontSize: 15 }}
                        color="green"
                      >
                        {item.question}
                      </Tag>
                    </Tooltip>
                  ))}
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button
                    type="primary"
                    className="btnPrimary"
                    htmlType="submit"
                    loading={btnLoading}
                  >
                    Save Game
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </Container>
      {show && (
        <Modal
          visible={show}
          title="Create Game"
          footer={null}
          onCancel={handleModalClose}
        >
          <Form form={modalForm} layout="vertical" onFinish={handleModalSubmit}>
            <Row>
              <Col>
                <Item
                  label="Question"
                  name="question"
                  rules={[{ message: "Required Field!", required: true }]}
                >
                  <Input type="text" />
                </Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Item
                  label="Choose Correct Products"
                  name="correctProduct"
                  rules={[{ message: "Required Field!", required: true }]}
                >
                  <Select>
                    {wishlistArray.list.map((item) => (
                      <Option value={item.id}>
                        <div>
                          <Avatar
                            src={item.image}
                            shape="square"
                            className="me-2"
                          />
                          {item.name}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Item
                  label="Choose Wrong Product"
                  name="wrongProduct"
                  rules={[{ message: "Required Field!", required: true }]}
                >
                  <Select>
                    {wishlistArray.list.map((item) => (
                      <Option value={item.id}>
                        <div>
                          <Avatar
                            src={item.image}
                            shape="square"
                            className="me-2"
                          />
                          {item.name}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit" className="btnPrimary">
                  Add Question
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default Games;
