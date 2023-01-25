import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Form, Button, Input, message } from "antd";
import { firebase } from "../Firebase/config";

const { Item } = Form;

const Add_Categories = () => {
  const [form] = Form.useForm();
  const [btnUpload, setBtnUpload] = useState(false);

  const handleAddCategory = async (values) => {
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
      .collection("categories")
      .add(values)
      .then(async () => {
        message.success("Category Created!");
        form.resetFields();
      })
      .catch((error) => {
        console.log(error);
        message.error("Error Creating Category!");
      });
    setBtnUpload(false);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddCategory}
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
    </>
  );
};

export default Add_Categories;
