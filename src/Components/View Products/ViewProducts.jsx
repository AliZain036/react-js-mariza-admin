import { useEffect, useState } from "react";
import { firebase } from "../../Firebase/config";
import { Row, Col } from "react-bootstrap";
import { Table, Tag } from "antd";

const ViewProducts = ({ id }) => {
  // state
  const [usersProduct, setUsersProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span>...{id.substr(id.length - 5)}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "URL",
      dataIndex: "productUrl",
      key: "url",
      render: (url) => (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a href={url} target="_blank">
          Link
        </a>
      ),
    },
  ];

  useEffect(() => {
    if (id) {
      getUserProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getUserProducts = async () => {
    try {
      await firebase
        .firestore()
        .collection("userproduct")
        .where("userid", "==", id)
        .get()
        .then((docs) => {
          let arr = [];
          docs.forEach((doc) => {
            let obj = {
              id: doc.id,
              ...doc.data(),
            };
            arr.push(obj);
          });
          setUsersProduct(arr);
        });
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h4 className="text-center">Products</h4>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col className="d-flex justify-content-center">
          <Tag className="my-2 rounded-pill font18 px-3 py-2" color="blue">
            Total Products: {usersProduct.length}
          </Tag>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="mt-3">
          <Table
            dataSource={usersProduct}
            columns={columns}
            loading={isLoading}
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

export default ViewProducts;
