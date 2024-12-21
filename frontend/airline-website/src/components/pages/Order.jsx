import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import "../../styles/order.css";


const Order = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng đã đăng nhập từ context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return; // Nếu chưa đăng nhập, không thực hiện API
    }

    // Hàm lấy chi tiết đơn hàng
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/booking/user/${user.id}`, {
          method: 'GET',
          credentials: 'include', // Gửi cookie session nếu có
        });

        if (res.ok) {
          const data = await res.json();
          // Chuyển đổi dữ liệu từ API (vì API trả về đối tượng có key là order_id)
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

    fetchOrders();
  }, [user]); // Chạy lại khi thông tin người dùng thay đổi

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
          </div>
        ))
      )}
    </div>
  );
};

export default Order;