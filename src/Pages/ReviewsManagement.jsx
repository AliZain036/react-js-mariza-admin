import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Space, 
  message, 
  Input, 
  Select, 
  Popconfirm, 
  Rate,
  Card,
  Divider,
  Row,
  Col,
  Badge,
  Tooltip,
  Typography,
  Image
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SearchOutlined, 
  EyeOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Star } from 'lucide-react';

// Firebase imports
import firebase from 'firebase/app';
import 'firebase/firestore';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDetail, setReviewDetail] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [productFilter, setProductFilter] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [totalStats, setTotalStats] = useState({
    pending: 0,
    approved: 0,
    total: 0
  });

  // Get Firestore instance
  const db = firebase.firestore();

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, productFilter]);

  // Extract unique product IDs for filter dropdown
  useEffect(() => {
    if (reviews.length > 0) {
      const uniqueProducts = [...new Set(reviews.map(review => review.productId))];
      setProductsList(uniqueProducts);
    }
  }, [reviews]);

  // Calculate total stats
  useEffect(() => {
    calculateTotalStats();
  }, []);

  const calculateTotalStats = async () => {
    try {
      // Get pending count
      const pendingQuery = db.collection('reviews')
        .where('approved', '==', false);
      const pendingSnapshot = await pendingQuery.get();
      
      // Get approved count
      const approvedQuery = db.collection('reviews')
        .where('approved', '==', true);
      const approvedSnapshot = await approvedQuery.get();
      
      // Get total count
      const totalQuery = db.collection('reviews');
      const totalSnapshot = await totalQuery.get();
      
      setTotalStats({
        pending: pendingSnapshot.size,
        approved: approvedSnapshot.size,
        total: totalSnapshot.size
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Base query
      let reviewsQuery;
      
      // Apply status filter
      if (statusFilter === 'all') {
        reviewsQuery = db.collection('reviews')
          .orderBy('createdAt', 'desc');
      } else if (statusFilter === 'pending') {
        reviewsQuery = db.collection('reviews')
          .where('approved', '==', false)
          .orderBy('createdAt', 'desc');
      } else if (statusFilter === 'approved') {
        reviewsQuery = db.collection('reviews')
          .where('approved', '==', true)
          .orderBy('createdAt', 'desc');
      }
      
      // Apply product filter if selected
      if (productFilter) {
        reviewsQuery = db.collection('reviews')
          .where('productId', '==', productFilter)
          .orderBy('createdAt', 'desc');
      }
      
      const querySnapshot = await reviewsQuery.get();
      
      const reviewsList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);
        reviewsList.push({
          id: doc.id,
          key: doc.id, // For table row selection
          userName: data.userName || 'Anonymous',
          rating: data.rating || 0,
          text: data.text || '',
          images: data.images || [],
          productId: data.productId || 'Unknown',
          approved: data.approved || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          formattedDate: formatDate(data.createdAt?.toDate())
        });
      });
      
      setReviews(reviewsList);
      
      // Update stats after fetching
      calculateTotalStats();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      message.error("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (date) => {
    if (!date) return "Unknown";
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle review approval
  const handleApprove = async (reviewId) => {
    try {
      await db.collection('reviews').doc(reviewId).update({
        approved: true
      });
      
      message.success("Review approved successfully");
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, approved: true } 
            : review
        )
      );
      
      // Update stats
      calculateTotalStats();
    } catch (error) {
      console.error("Error approving review:", error);
      message.error("Failed to approve review. Please try again.");
    }
  };

  // Handle review rejection
  const handleReject = async (reviewId) => {
    try {
      await db.collection('reviews').doc(reviewId).update({
        approved: false
      });
      
      message.success("Review rejected");
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, approved: false } 
            : review
        )
      );
      
      // Update stats
      calculateTotalStats();
    } catch (error) {
      console.error("Error rejecting review:", error);
      message.error("Failed to reject review. Please try again.");
    }
  };

  // Handle review deletion
  const handleDelete = async (reviewId) => {
    try {
      await db.collection('reviews').doc(reviewId).delete();
      
      message.success("Review deleted successfully");
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== reviewId)
      );
      
      // Close detail modal if open
      if (detailVisible && reviewDetail?.id === reviewId) {
        setDetailVisible(false);
      }
      
      // Update stats
      calculateTotalStats();
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Failed to delete review. Please try again.");
    }
  };

  // View review details
  const viewReviewDetails = (review) => {
    setReviewDetail(review);
    setDetailVisible(true);
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    if (selectedRowKeys.length === 0) {
      message.info('No reviews selected');
      return;
    }
    
    try {
      // Create array of update promises
      const promises = selectedRowKeys.map(reviewId => 
        db.collection('reviews').doc(reviewId).update({ approved: true })
      );
      
      await Promise.all(promises);
      
      message.success(`${selectedRowKeys.length} reviews approved successfully`);
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          selectedRowKeys.includes(review.id) 
            ? { ...review, approved: true } 
            : review
        )
      );
      
      // Clear selection
      setSelectedRowKeys([]);
      
      // Update stats
      calculateTotalStats();
    } catch (error) {
      console.error('Error in bulk approve:', error);
      message.error('Failed to approve reviews. Please try again.');
    }
  };

  // Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedRowKeys.length === 0) {
      message.info('No reviews selected');
      return;
    }
    
    try {
      const promises = selectedRowKeys.map(reviewId => 
        db.collection('reviews').doc(reviewId).update({ approved: false })
      );
      
      await Promise.all(promises);
      
      message.success(`${selectedRowKeys.length} reviews rejected`);
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          selectedRowKeys.includes(review.id) 
            ? { ...review, approved: false } 
            : review
        )
      );
      
      // Clear selection
      setSelectedRowKeys([]);
      
      // Update stats
      calculateTotalStats();
    } catch (error) {
      console.error('Error in bulk reject:', error);
      message.error('Failed to reject reviews. Please try again.');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.info('No reviews selected');
      return;
    }
    
    try {
      const promises = selectedRowKeys.map(reviewId => 
        db.collection('reviews').doc(reviewId).delete()
      );
      
      await Promise.all(promises);
      
      message.success(`${selectedRowKeys.length} reviews deleted successfully`);
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.filter(review => !selectedRowKeys.includes(review.id))
      );
      
      // Clear selection
      setSelectedRowKeys([]);
      
      // Update stats
      calculateTotalStats();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      message.error('Failed to delete reviews. Please try again.');
    }
  };

  // Filter reviews based on search text
  const getFilteredReviews = () => {
    if (!searchText) return reviews;
    
    return reviews.filter(review => 
      review.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
      review.text?.toLowerCase().includes(searchText.toLowerCase()) ||
      review.productId?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
  
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating) => (
        <Rate 
          disabled 
          value={rating} 
        //   character={<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
        />
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Review',
      dataIndex: 'text',
      key: 'text',
      ellipsis: true,
      render: (text) => text.length > 50 ? `${text.substring(0, 50)}...` : text,
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      width: 120,
      render: (images) => (
        images && images.length > 0 ? (
          <div className="d-flex gap-1">
            {images.slice(0, 3).map((image, index) => (
              <img 
                key={index}
                src={image.url} 
                alt={`Review ${index + 1}`}
                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                onClick={() => {
                  setPreviewImage(image.url);
                  setImagePreviewVisible(true);
                }}
                className="cursor-pointer"
              />
            ))}
            {images.length > 3 && (
              <div 
                className="d-flex align-items-center justify-content-center"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setReviewDetail({ images });
                  setImagePreviewVisible(true);
                }}
              >
                +{images.length - 3}
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted">No images</span>
        )
      ),
    },
    {
      title: 'Date',
      dataIndex: 'formattedDate',
      key: 'formattedDate',
      width: 180,
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: 'Status',
      dataIndex: 'approved',
      key: 'approved',
      width: 120,
      render: (approved) => (
        <Tag color={approved ? 'success' : 'warning'} icon={approved ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {approved ? 'Approved' : 'Pending'}
        </Tag>
      ),
      filters: [
        { text: 'Approved', value: true },
        { text: 'Pending', value: false },
      ],
      onFilter: (value, record) => record.approved === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {/* <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => viewReviewDetails(record)}
          >
            View
          </Button> */}
          {!record.approved ? (
            <Button 
              type="primary" 
              size="small" 
              className="bg-green-600 hover:bg-green-500"
              onClick={() => handleApprove(record.id)}
            >
              Approve
            </Button>
          ) : (
            <Button 
              size="small" 
              danger 
              onClick={() => handleReject(record.id)}
            >
              Reject
            </Button>
          )}
          <Popconfirm
            title="Delete this review?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="reviews-management p-4">
      <Title level={2}>Reviews Management</Title>
      
      {/* Stats Cards */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={8}>
          <Card className="text-center h-100">
            <Title level={1} className="mb-0">{totalStats.total}</Title>
            <Text className="text-muted">Total Reviews</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center h-100 bg-success bg-opacity-10">
            <Title level={1} className="mb-0 text-success">{totalStats.approved}</Title>
            <Text className="text-success">Approved</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center h-100 bg-warning bg-opacity-10">
            <Badge count={totalStats.pending} overflowCount={999} offset={[10, 10]}>
              <Title level={1} className="mb-0 text-warning">{totalStats.pending}</Title>
              <Text className="text-warning">Pending Approval</Text>
            </Badge>
          </Card>
        </Col>
      </Row>
      
      {/* Filters & Search */}
      <div className="mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            placeholder="Filter by status"
          >
            <Option value="all">All Reviews</Option>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
          </Select>
          
        
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchReviews}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
        
        <Input
          placeholder="Search reviews..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </div>
      
      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-3 bg-light rounded d-flex align-items-center">
          <Text strong className="me-3">
            {selectedRowKeys.length} {selectedRowKeys.length === 1 ? 'review' : 'reviews'} selected
          </Text>
          <Space>
            <Button 
              type="primary" 
              onClick={handleBulkApprove}
              className="bg-success border-success"
            >
              Approve All
            </Button>
            <Button 
              danger
              onClick={handleBulkReject}
            >
              Reject All
            </Button>
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} reviews?`}
              description="This action cannot be undone."
              onConfirm={handleBulkDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete All
              </Button>
            </Popconfirm>
          </Space>
        </div>
      )}
      
      {/* Reviews Table */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={getFilteredReviews()}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      
      {/* Review Details Modal */}
      <Modal
        title={
          <div className="d-flex justify-content-between align-items-center">
            <span>Review Details</span>
            {reviewDetail && (
              <Tag color={reviewDetail.approved ? 'success' : 'warning'}>
                {reviewDetail.approved ? 'Approved' : 'Pending Approval'}
              </Tag>
            )}
          </div>
        }
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          reviewDetail && (
            <div className="d-flex justify-content-between">
              <Popconfirm
                title="Delete this review?"
                description="This action cannot be undone."
                onConfirm={() => {
                  handleDelete(reviewDetail.id);
                  setDetailVisible(false);
                }}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
              
              <div>
                <Button onClick={() => setDetailVisible(false)} className="me-2">
                  Close
                </Button>
                {!reviewDetail.approved ? (
                  <Button 
                    type="primary" 
                    className="bg-success border-success"
                    onClick={() => {
                      handleApprove(reviewDetail.id);
                      setDetailVisible(false);
                    }}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button 
                    danger
                    onClick={() => {
                      handleReject(reviewDetail.id);
                      setDetailVisible(false);
                    }}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          )
        }
        width={700}
      >
        {reviewDetail && (
          <div>
          
          
            
            <div className="mb-4">
              <Text type="secondary">User</Text>
              <div className="fw-bold">{reviewDetail.userName}</div>
            </div>
            
            <div className="mb-4">
              <Text type="secondary">Rating</Text>
              <div>
                <Rate 
                  disabled 
                  value={reviewDetail.rating} 
                  character={<Star className="text-warning" />}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Text type="secondary">Date</Text>
              <div>{reviewDetail.formattedDate}</div>
            </div>
            
            <div className="mb-4">
              <Text type="secondary">Review</Text>
              <div className="p-3 bg-light rounded mt-1">{reviewDetail.text}</div>
            </div>
            
            {reviewDetail.images && reviewDetail.images.length > 0 && (
              <div>
                <Text type="secondary">Images</Text>
                <div className="row row-cols-4 g-2 mt-1">
                  {reviewDetail.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="cursor-pointer"
                      onClick={() => {
                        setPreviewImage(image.url);
                        setImagePreviewVisible(true);
                      }}
                    >
                      <img 
                        src={image.url} 
                        alt={`Review ${index + 1}`} 
                        className="w-100 h-100 object-fit-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
      
      {/* Image Preview Modal */}
      <Modal
        visible={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ReviewsManagement;
