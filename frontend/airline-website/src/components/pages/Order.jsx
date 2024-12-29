import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import "../../styles/order.css";

const Order = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng đã đăng nhập từ context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders based on user ID
  const fetchOrders = async () => {
    if (!user) {
      return; // Nếu chưa đăng nhập, không thực hiện API
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/booking/user/${user.id}`, {
        method: 'GET',
        credentials: 'include', // Gửi cookie session nếu có
      });

      if (res.ok) {
        const data = await res.json();
        const ordersList = Object.values(data); // Lấy tất cả các đơn hàng
        setOrders(ordersList); // Cập nhật danh sách đơn hàng
      } else {
        throw new Error('Không thể lấy thông tin đơn hàng');
      }
    } catch (error) {
      setError(error.message); // Xử lý lỗi nếu có
    } finally {
      setLoading(false); // Đánh dấu hoàn tất việc lấy dữ liệu
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders when component mounts
  }, [user]);

  // Hàm xóa đơn hàng
  const handleDeleteOrder = async (orderId) => {
    try {
      // Fetch user_id from /api/users/session before making the DELETE request
      const userRes = await fetch('http://localhost:3000/api/users/session', {
        method: 'GET',
        credentials: 'include', // Include cookies for session management
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        const user_id = userData.id; // Get user_id from the session response

        // Use the fetched user_id in the DELETE request
        const res = await fetch(`http://localhost:3000/api/booking/${user_id}/${orderId}/`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.ok) {
          alert('Đơn hàng đã được xóa thành công!');
          await fetchOrders(); // Gọi lại hàm fetchOrders để cập nhật danh sách đơn hàng
        } else {
          throw new Error('Không thể xóa đơn hàng');
        }
      } else {
        throw new Error('Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Đang tải đơn hàng...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <h2>Thông tin đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="order">
            <h3>Đơn hàng {order.order_id}</h3>
            <p><strong>Tình trạng:</strong> {order.status}</p>
            <p><strong>Tổng giá:</strong> {order.total_price} VND</p>
            <h4>Chi tiết chuyến bay</h4>
            {order.flight_details.map((detail, index) => (
              <div key={index} className="flight-detail">
                <p><strong>Chuyến bay:</strong> {detail.flight_code}</p>
                <p><strong>Thời gian cất cánh:</strong> {new Date(detail.departure_time).toLocaleString()}</p>
                <p><strong>Thời gian hạ cánh:</strong> {new Date(detail.arrival_time).toLocaleString()}</p>
                <p><strong>Loại vé:</strong> {detail.ticket_type_name}</p>
                <p><strong>Số lượng:</strong> {detail.quantity}</p>
                <p><strong>Giá vé:</strong> {detail.price} VND</p>
                <p><strong>Tổng giá chuyến bay:</strong> {detail.total_price} VND</p>
              </div>
            ))}
            {/* Thêm nút xóa đơn hàng */}
            <button onClick={() => handleDeleteOrder(order.order_id)} className="delete-button">
              Huỷ đơn hàng
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
