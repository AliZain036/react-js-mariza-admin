/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Tabs,
  Select,
  Card,
} from "antd";
import { firebase } from "../Firebase/config";
import { cloneDeep, some } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { fetchOccasions } from "../Redux/Actions/occasions";

const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;

const Occasions = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [allOccasions, setAllOccasions] = useState([]);
  const [search, setSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [btnUpload, setBtnUpload] = useState(false);
  const [edit, setEdit] = useState(null);
  const [key, setKey] = useState("1");
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span>...{id.substr(id.length - 5)}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Liked",
      dataIndex: "id",
      key: "liked",
      render: (id, item) => (
        <div title="Likes" className="text-primary">
          <strong>{item?.stats?.liked}</strong>
          <span className="ms-1">
            <i className="fa fa-thumbs-up"></i>
          </span>
        </div>
      ),
      sorter: (a, b) => a.stats.liked - b.stats.liked,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <div className="d-flex">
          <Button
            onClick={() => handleEdit(id)}
            className="btnSecondary me-2"
            type="primary"
            loading={btnUpload === id}
          >
            <i className="fa fa-edit"></i>
          </Button>
          <Button
            onClick={() => handleDelete(id)}
            className="btnDanger"
            type="primary"
            loading={btnUpload === id}
          >
            <i className="fa fa-trash"></i>
          </Button>
        </div>
      ),
    },
  ];

  // redux
  const dispatch = useDispatch();
  const occasionsRedux = useSelector((state) => state.occasions);

  useEffect(() => {
    if (occasionsRedux.isLoading) {
      getOccasions();
    }
    setAllOccasions(occasionsRedux.occasions);
    setSearch(occasionsRedux.occasions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasionsRedux]);

  const getOccasions = async () => {
    // categories
    setIsLoading(true);
    await dispatch(fetchOccasions());
    setIsLoading(false);
  };

  const handleAddOccasion = async (values) => {
    let check = some(
      allOccasions,
      (item) => item.name.toLowerCase() === values.name.toLowerCase()
    );
    if (check) {
      message.warning({
        key: "warning_duplicate",
        content: "Occasion with this name already exist.",
      });
      return;
    }
    setBtnUpload(true);
    const stats = {
      liked: 0,
      shared: 0,
      saved: 0,
      won: 0,
      clicked: 0,
    };
    values.stats = stats; // setting default values to each product
    await firebase
      .firestore()
      .collection("occasions")
      .add(values)
      .then(() => {
        message.success("Occasion Created!");
        handleModalClose();
        getOccasions();
      })
      .catch((error) => {
        console.log(error);
        message.error("Error Creating Occasion!");
      });
    setBtnUpload(false);
  };

  const handleModalClose = () => {
    setShow(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    setBtnUpload(id);
    await firebase
      .firestore()
      .collection("occasions")
      .doc(id)
      .delete()
      .then(async () => {
        message.success("Occasion Deleted!");
        await getOccasions();
      });
    setBtnUpload("");
  };

  const handleEdit = (id) => {
    let obj = allOccasions.find((item) => item.id === id);
    setEdit(obj);
    Object.entries(obj).map(([key, value]) => {
      editForm.setFieldsValue({
        [key]: value,
      });
    });
    setKey("2");
  };

  const handleEditOccasion = async (values) => {
    setBtnUpload(edit.id);
    // if new image is added
    await firebase
      .firestore()
      .collection("occasions")
      .doc(edit.id)
      .set({ name: values.name }, { merge: true })
      .then(() => {
        message.success(edit.name + " Updated!");
        handleBack(); // back to list
        getOccasions();
      })
      .catch((e) => {
        message.error("Problem updating " + edit.name);
        console.log(e);
      });
    setBtnUpload("");
  };

  // back to list page (category)
  const handleBack = () => {
    setKey("1");
    setEdit(null);
  };

  const handleSearch = (value) => {
    let arr = cloneDeep(allOccasions);
    arr = arr.filter((item) => item.id === value);
    setSearch(arr);
  };

  const handleClear = (value) => {
    setSearch(allOccasions);
  };

  return (
    <>
      <Container>
        <Tabs activeKey={key} animated>
          <TabPane key="1">
            <Row className="mb-2">
              <Col>
                <Button
                  loading={isLoading}
                  onClick={() => setShow(true)}
                  className="btnPrimary"
                  type="primary"
                  size="large"
                >
                  + Add Occasions
                </Button>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="d-flex justify-content-center">
                <Tag
                  className="my-2 rounded-pill font18 px-3 py-2"
                  color="blue"
                >
                  Total Occasions: {search ? search.length : 0}
                </Tag>
              </Col>
            </Row>
            <Row className="mb-2 d-flex justify-content-end">
              <Col md={4}>
                <Select
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Search Occasion"
                  // onChange={handleSearch}
                  onClear={handleClear}
                  onSelect={handleSearch}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {search.map((item) => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
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
                        onFinish={handleEditOccasion}
                        form={editForm}
                        size="large"
                      >
                        <Row>
                          <Col md={6}>
                            <Item
                              label="Name"
                              name="name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter title!",
                                },
                              ]}
                              className="fw-bold"
                            >
                              <Input type="text" />
                            </Item>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col className="d-flex justify-content-end">
                            <Button
                              loading={btnUpload}
                              className="btnPrimary"
                              htmlType="submit"
                              type="primary"
                            >
                              Update
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
        </Tabs>
      </Container>
      <Modal
        title="Add New Occasion"
        visible={show}
        footer={false}
        onCancel={handleModalClose}
      >
        <Form
          layout="vertical"
          onFinish={handleAddOccasion}
          form={form}
          size="large"
        >
          <Row>
            <Col>
              <Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter title!" }]}
                className="fw-bold"
              >
                <Input type="text" />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button
                loading={btnUpload}
                className="btnPrimary"
                htmlType="submit"
                type="primary"
              >
                Post
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Occasions;
