import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

// Các thành phần style cho giao diện
const DashboardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Khoảng cách giữa biểu đồ và bảng */
  padding: 20px;
`;

const TableContainer = styled.div`
  width: 100%; /* Chiều rộng bảng */
  overflow-x: auto; /* Cho phép bảng cuộn ngang nếu vượt quá chiều rộng */
`;

const ModalContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Styled component cho màu sắc trạng thái đơn hàng và chữ nghiêng
const StatusCell = styled.td`
  color: ${(props) => {
    switch (props.status) {
      case 'Pending':
        return 'green';
      case 'Completed':
        return 'gold';
      case 'Cancelled':
        return 'red';
      default:
        return 'black';
    }
  }};
  font-weight: bold;
  font-style: italic; /* Áp dụng kiểu chữ nghiêng cho Pending, Completed, Cancelled */
`;

// Styled component cho nút "Xem chi tiết" (trong suốt không có viền)
const ViewDetailsButton = styled(Button)`
  background: transparent;
  border: none; /* Xóa viền */
  color:rgb(211, 228, 235); 
  font-weight: bold;
  width: 100%;

  &:hover {
    background: transparent; /* Giữ nền trong suốt khi hover */
    color:rgb(16, 124, 197); 
  }
`;

// Styled component cho hàng được làm nổi bật bằng màu vàng
const GoldRow = styled.tr`
  background-color: PowderBlue;
`;

// Thành phần chính
function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Theo dõi đơn hàng đã chọn để xem chi tiết
  const [openModal, setOpenModal] = useState(false); // Theo dõi trạng thái mở modal
  const [sortOrder, setSortOrder] = useState('asc'); // Trạng thái sắp xếp

  useEffect(() => {
    // Lấy đơn hàng từ API
    axios.get('/admin/admin/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
      });
  }, []);

  const handleToggleDetails = (orderId) => {
    // Chuyển trạng thái mở modal và thiết lập đơn hàng đã chọn
    const order = orders.find((order) => order.order_id === orderId);
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null); // Xóa đơn hàng đã chọn khi đóng modal
  };

  const renderOrderDetails = (order) => {
    return order?.order_details.map((detail) => (
      <ModalContainer key={detail.order_detail_id}>
        <p><strong>Chuyến bay:</strong> {detail.flight_code}</p>
        <p><strong>Loại vé:</strong> {detail.ticket_type_name}</p>
        <p><strong>Giá:</strong> {detail.price}</p>
        <p><strong>Giờ khởi hành:</strong> {new Date(detail.departure_time).toLocaleString()}</p>
        <p><strong>Giờ đến:</strong> {new Date(detail.arrival_time).toLocaleString()}</p>
      </ModalContainer>
    ));
  };

  const handleSort = () => {
    // Chuyển trạng thái sắp xếp và sắp xếp lại mảng đơn hàng
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sortedOrders = [...orders].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return parseFloat(a.total_price) - parseFloat(b.total_price);
      } else {
        return parseFloat(b.total_price) - parseFloat(a.total_price);
      }
    });
    setOrders(sortedOrders);
  };

  const renderArrowIcon = () => {
    return sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
  };

  const getRowStyle = (index) => {
    // Làm nổi bật 3 đơn hàng đầu tiên có giá trị cao nhất bằng màu vàng
    return index < 3 ? { backgroundColor: 'PowderBlue' } : {};
  };

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <DashboardContainer>
        {/* Container bảng */}
        <TableContainer>
          <table border="1" cellPadding="10" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Mã đơn hàng</th>
                <th style={{ textAlign: 'left' }}>Tên đăng nhập</th>
                <th style={{ textAlign: 'left' }}>Họ và tên</th>
                <th style={{ textAlign: 'left' }}>Email</th>
                <th style={{ textAlign: 'left' }}>Tổng giá trị
                  <button onClick={handleSort} style={{ background: 'transparent', border: 'none' }}>
                    {renderArrowIcon()}
                  </button>
                </th>
                <th style={{ textAlign: 'left' }}>Ngày đặt</th>
                <th style={{ textAlign: 'left' }}>Trạng thái đơn hàng</th>
                <th style={{ textAlign: 'left' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <GoldRow key={order.order_id} style={getRowStyle(index)}>
                  <td style={{ textAlign: 'left' }}>{order.order_id}</td>
                  <td style={{ textAlign: 'left' }}>{order.username}</td>
                  <td style={{ textAlign: 'left' }}>{order.full_name}</td>
                  <td style={{ textAlign: 'left' }}>{order.email}</td>
                  <td style={{ textAlign: 'left' }}>{order.total_price}</td>
                  <td style={{ textAlign: 'left' }}>{new Date(order.order_date).toLocaleString()}</td>
                  <StatusCell status={order.order_status}>
                    {order.order_status}
                  </StatusCell>
                  <td>
                    <ViewDetailsButton variant="outlined" onClick={() => handleToggleDetails(order.order_id)}>
                      Xem chi tiết
                    </ViewDetailsButton>
                  </td>
                </GoldRow>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </DashboardContainer>

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && renderOrderDetails(selectedOrder)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageOrders;
