import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Divider, Table, Tag, Space, Avatar } from "antd";
import { firebase } from "../../Firebase/config";
import "./viewWishlist.css";

const getWishlistByID = async (id) => {
  try {
    const obj = await firebase
      .firestore()
      .collection("wishlists")
      .doc(id)
      .get();
    return obj.data();
  } catch (error) {
    console.log(error);
  }
};

const ViewWIshlist = ({ id, wishlist = [] }) => {
  // state
  const [privateWishlist, setPrivate] = useState([]);
  const [publicWishlist, setPublic] = useState([]);

  useEffect(() => {
    if (Array.isArray(wishlist) && wishlist.length > 0) {
      getWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist]);

  const getWishlist = async () => {
    let arr = [];
    for (let i = 0; i < wishlist.length; i++) {
      const id = wishlist[i];
      let wishList = await getWishlistByID(id);
      arr.push(wishList);
    }
    setPrivate(arr.filter((item) => item.isPrivate));
    setPublic(arr.filter((item) => !item.isPrivate));
  };

  const privateColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        products.map((item) => (
          <Space wrap>
            <Tag>
              <Avatar src={item.image} shape="square" className="me-1" />
              {item.name}
            </Tag>
          </Space>
        )),
    },
  ];
  const publicColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        products.map((item) => (
          <Space wrap>
            <Tag>
              <Avatar src={item.image} shape="square" className="me-1" />
              {item.name}
            </Tag>
          </Space>
        )),
    },
  ];

  return (
    <>
      <Row>
        <Col>
          <h3 className="text-center">Wishlist</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="titleCol">
          <span>Private</span>
        </Col>
        <Col xs={12} className="mt-3">
          <Table
            dataSource={privateWishlist}
            columns={privateColumns}
            scroll={{ x: true }}
            pagination={{
              position: ["bottomCenter"],
            }}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs={12} className="titleCol">
          <span>Public</span>
        </Col>
        <Col xs={12} className="mt-3">
          <Table
            dataSource={publicWishlist}
            columns={publicColumns}
            scroll={{ x: true }}
            pagination={{
              position: ["bottomCenter"],
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default ViewWIshlist;
