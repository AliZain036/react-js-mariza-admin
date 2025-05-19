import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card,
  Tag, 
  Modal,
  Spin,
  message,
  Select,
  Row,
  Col,
  Descriptions,
  Divider,
  Typography,
  Image
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { firebase } from "../Firebase/config";

const { Title, Text } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [productsDetails, setProductsDetails] = useState({});

  useEffect(() => {
    getOrders();
  }, []);

  // Fetch product details when selectedOrder changes
  useEffect(() => {
    if (selectedOrder?.products) {
      fetchProductDetails();
    }
  }, [selectedOrder]);

  const fetchProductDetails = async () => {
    try {
      const productIds = selectedOrder.products.map(product => product.product);
      const productDetails = {};
      
      await Promise.all(
        productIds.map(async (productId) => {
          const doc = await firebase
            .firestore()
            .collection("products")
            .doc(productId)
            .get();
          
          if (doc.exists) {
            productDetails[productId] = doc.data();
          }
        })
      );
      
      setProductsDetails(productDetails);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const getOrders = async () => {
    try {
      const response = await firebase
        .firestore()
        .collection("orders")
        .orderBy("orderDate", "desc")
        .get();
      
      const data = response.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      
      setOrders(data);
    } catch (error) {
      message.error("Error fetching orders");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrder = async (orderStatus, orderData) => {
    try {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection("orders")
        .doc(orderData.id)
        .set({ ...orderData, orderStatus }, { merge: true });
      
      message.success("Order status updated");
      await getOrders();
    } catch (error) {
      message.error("Error updating order");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection("orders")
        .doc(id)
        .delete();
      
      message.success("Order deleted successfully");
      await getOrders();
    } catch (error) {
      message.error("Error deleting order");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => <Text>{id.slice(0, 8)}...</Text>
    },
    {
      title: "Customer",
      dataIndex: "shipping_details",
      key: "customer",
      render: (shipping_details) => (
        <div>
          <Text strong>{shipping_details?.name}</Text>
          <br />
          <Text type="secondary">
            {shipping_details?.email}
          </Text>
        </div>
      )
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => (
        <Text>{moment(date).format("YYYY-MM-DD hh:mm A")}</Text>
      )
    },
    {
      title: "Total Amount",
      dataIndex: "session",
      key: "amount",
      render: (session) => (
        <Text strong>£{(session?.amount_total / 100).toFixed(2)}</Text>
      )
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      render: (status, record) => (
        <Select
          defaultValue={status?.toLowerCase()}
          style={{ width: 120 }}
          onChange={(value) => handleUpdateOrder(value, record)}
        >
          <Option value="pending">Pending</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="completed">Completed</Option>
          <Option value="Ready To Ship">Ready To Ship</Option>

        </Select>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button 
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedOrder(record);
            setDetailsModalVisible(true);
          }}
        >
          Details
        </Button>
      )
    }
  ];

  

  
 
  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {record?.image && (
            <Image 
              src={record.image[0]} 
              alt={record.name}
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record?.description?.slice(0, 100)}...
            </Text>
            <div style={{ marginTop: '4px' }}>
              {record.size && (
                <Tag color="blue">Size: {record.size}</Tag>
              )}
              {record.color && (
                <Tag color="purple">Color: {record.color}</Tag>
              )}
              {record.stitched && (
                <Tag color="green">Stitched: {record.stitched}</Tag>
              )}
              {record.lining && (
                <Tag color="orange">Lining: {record.lining}</Tag>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Unit Price',
      dataIndex: 'prod_price',
      key: 'prod_price',
      width: 120,
      render: (price) => (
        <Text strong>£{price}</Text>
      )
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      render: (_, record) => (
        <Text strong type="success">
          £{(record.prod_price * record.quantity).toFixed(2)}
        </Text>
      )
    }
  ];

  return (
    <Spin spinning={isLoading}>
      <Card className="m-4">
        <div className="mb-4 flex justify-between items-center">
          <Title level={4}>Orders Management</Title>
          <Tag color="blue" className="text-lg px-4 py-1">
            Total Orders: {orders.length}
          </Tag>
        </div>
     
     

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true
          }}
        />

        <Modal
          title={<Title level={4}>Order Details</Title>}
          visible={detailsModalVisible}
          onCancel={() => {
            setDetailsModalVisible(false);
            setProductsDetails({});
            setSelectedOrder(null);
          }}
          width={1000}
          footer={null}
        >
          {selectedOrder && (
            <div style={{ gap: '24px', display: 'flex', flexDirection: 'column' }}>
              <Descriptions title="Customer Information" bordered>
                <Descriptions.Item label="Name" span={3}>
                  {selectedOrder.shipping_details?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={3}>
                  {selectedOrder.shipping_details?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone" span={3}>
                  {selectedOrder.shipping_details?.phone}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="Shipping Details" bordered>
                <Descriptions.Item label="Address" span={3}>
                  {`${selectedOrder.shipping_details?.address_line_1}, 
                    ${selectedOrder.shipping_details?.address_line_2}`}
                </Descriptions.Item>
                <Descriptions.Item label="City" span={1}>
                  {selectedOrder.shipping_details?.city}
                </Descriptions.Item>
                <Descriptions.Item label="Country" span={1}>
                  {selectedOrder.shipping_details?.country}
                </Descriptions.Item>
                <Descriptions.Item label="Postal Code" span={1}>
                  {selectedOrder.shipping_details?.zip_code}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="Order Information" bordered>
                <Descriptions.Item label="Order Date">
                  {moment(selectedOrder.orderDate).format("YYYY-MM-DD hh:mm A")}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Type">
                  {selectedOrder.
shipping_option
.display_name}
                  {console.log(selectedOrder,"selectedOrder")}
                </Descriptions.Item>
                
                <Descriptions.Item label="Status">
                  <Tag color={
                    selectedOrder.orderStatus === "completed" ? "green" :
                    selectedOrder.orderStatus === "shipped" ? "blue" : "gold"
                  }>
                    {selectedOrder.orderStatus?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  £{(selectedOrder.session?.amount_total / 100).toFixed(2)}
                </Descriptions.Item>
              </Descriptions>

              {selectedOrder.products && (
  <>
    <Title level={5}>Products</Title>
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <Table 
        dataSource={selectedOrder.cart} // Use cart data directly
        columns={productColumns}
        pagination={false}
        rowKey={(record) => record.id || record.product}
        // summary={(pageData) => {
        //   const total = pageData.reduce((acc, current) => 
        //     acc + (current.prod_price * current.quantity), 0
        //   );
          
        //   return (
        //     <Table.Summary.Row>
        //       <Table.Summary.Cell index={0} colSpan={3}>
        //         <Text strong>Total Order Amount:</Text>
        //       </Table.Summary.Cell>
        //       <Table.Summary.Cell index={1}>
        //         <Text strong type="danger">£{total.toFixed(2)}</Text>
        //       </Table.Summary.Cell>
        //     </Table.Summary.Row>
        //   );
        // }}
      />
    </div>
  </>
)}
            </div>
          )}
        </Modal>
      </Card>
    </Spin>
  );
};

export default Orders;