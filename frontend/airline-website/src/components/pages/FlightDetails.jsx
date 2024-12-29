import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import useCart
import '../../styles/flightdetails.css'; 
import travel1 from '../../assets/image/4.jpg';
import travel2 from '../../assets/image/2.jpg';
import travel3 from '../../assets/image/3.jpg';
import travel4 from '../../assets/image/1.jpg';
import travel5 from '../../assets/image/5.jpg';
import travel6 from '../../assets/image/6.jpg';
import travel7 from '../../assets/image/7.jpg';
import travel8 from '../../assets/image/8.jpg';
import travel9 from '../../assets/image/9.jpg';
import travel10 from '../../assets/image/10.jpg';

const FlightDetails = () => {
  const images = [travel1, travel2, travel3, travel4, travel5, travel6, travel7, travel8, travel9, travel10];
  const randomIndex = Math.floor(Math.random() * images.length); 
  const { flight_code } = useParams();
  const [flight, setFlight] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Sử dụng useCart để thêm chuyến bay vào giỏ hàng

  useEffect(() => {
    fetch(`http://localhost:3000/api/flights/${flight_code}`)
      .then((response) => response.json())
      .then((data) => {
        setFlight(data);
      })
      .catch((err) => console.error('Error fetching flight details:', err));
  }, [flight_code]);

  // Nếu flight chưa có dữ liệu, trả về loading
  if (!flight) {
    return <p>Loading...</p>;
  }

  // Lấy giá vé từ vé đầu tiên
  const ticketPrice = flight.tickets && flight.tickets[0]?.price;

  // Hàm xử lý thêm chuyến bay vào giỏ hàng
  const handleAddToCart = () => {
    if (ticketPrice) {
      addToCart(flight, 1, ticketPrice); // Giả sử mỗi lần thêm vào giỏ hàng là 1 vé
      alert(`${flight.flight_code} đã được thêm vào giỏ hàng!`);
    }
  };

  return (
    <div className="flight-details-container">
      <div className="flight-header">
        <h1 className="flight-title">Chi tiết chuyến bay: {flight.flight_code}</h1>
        <img
          src={images[randomIndex]}
          alt={flight.departure.location}
          className="flight-header-image"
        />
      </div>

      <div className="flight-info-section">
        <div className="flight-info-left">
          <div className="flight-info-item">
            <span className="info-label">Mã chuyến bay:</span>
            <span className="info-value">{flight.flight_code}</span>
          </div>
          <div className="flight-info-item">
            <span className="info-label">Hãng hàng không:</span>
            <span className="info-value">{flight.airline}</span>
          </div>
          <div className="flight-info-item">
            <span className="info-label">Trạng thái:</span>
            <span className="info-value">{flight.status}</span>
          </div>

          <div className="flight-info-item">
            <span className="info-label">Số ghế còn lại:</span>
            <span className="info-value">{flight.airplane?.seat_count || 'N/A'}</span>
          </div>
          <div className="flight-info-item">
            <span className="info-label">Giá vé:</span>
            <span className="info-value">{ticketPrice ? ticketPrice.toLocaleString() : 'N/A'}</span>
          </div>
        </div>

        <div className="flight-info-right">
          <div className="flight-info-item">
            <span className="info-label">Khởi hành:</span>
            <span className="info-value">{flight.departure.location}</span>
            <span className="info-time">
              {flight.departure?.time ? new Date(flight.departure.time).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="flight-info-item">
            <span className="info-label">Đến:</span>
            <span className="info-value">{flight.arrival.location}</span>
            <span className="info-time">
              {flight.arrival?.time ? new Date(flight.arrival.time).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <button className="view__all" onClick={() => navigate('/booking', { state: { flight } })}>
        Đặt vé
      </button>

      {/* Thêm vào giỏ hàng */}
      <button className="view__all" onClick={handleAddToCart}>
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default FlightDetails;
