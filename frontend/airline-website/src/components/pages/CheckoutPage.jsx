import React, { useState, useContext } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './checkout.css';

const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart, voucherCode } = useCart(); // Lấy voucherCode từ CartContext
  const { user } = useContext(AuthContext); 
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (!user) {
      alert('Bạn cần đăng nhập để thanh toán!');
      return;
    }

    if (!passengerName || !email || !phone) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Gửi thông tin đặt vé và thanh toán
    const orderData = {
      user_id: user.id,
      passengerName,
      email,
      phone,
      totalPrice,
      orderDetails: cart.map(item => ({
        flightCode: item.flight.flight_code,
        ticketType: item.flight.tickets[0].type,
        quantity: item.quantity,
        price: item.ticketPrice
      }))
    };

    // Nếu có voucher đã được chọn, chỉ thêm voucherCode vào orderData
    if (voucherCode) {
      orderData.voucherCode = voucherCode.code; // Lấy voucherCode từ CartContext
    }

    fetch('http://localhost:3000/api/users/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Thanh toán thành công!') {
        clearCart();
        alert('Thanh toán thành công!');
        navigate('/home'); // Chuyển hướng sau khi thanh toán
      } else {
        alert('Thanh toán thất bại, vui lòng thử lại.');
      }
    })
    .catch(error => {
      console.error('Lỗi khi thanh toán:', error);
      alert('Có lỗi xảy ra khi thanh toán.');
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Thanh toán</Typography>
      <Box className="checkout-form" sx={{ marginBottom: 3 }}>
        <TextField 
          fullWidth
          label="Họ và Tên"
          variant="outlined"
          value={passengerName} 
          onChange={e => setPassengerName(e.target.value)} 
          sx={{ marginBottom: 2 }}
        />
        <TextField 
          fullWidth
          label="Email"
          variant="outlined"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          sx={{ marginBottom: 2 }}
        />
        <TextField 
          fullWidth
          label="Số điện thoại"
          variant="outlined"
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          sx={{ marginBottom: 3 }}
        />
      </Box>

      <Box className="checkout-summary" sx={{ marginBottom: 3 }}>
        <Typography variant="h6"><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND</Typography>
      </Box>

      {/* Hiển thị voucher nếu có */}
      {voucherCode && (
        <Box className="voucher-info" sx={{ marginBottom: 3 }}>
          <Typography variant="body1"><strong>Mã Voucher:</strong> {voucherCode.code} - Giảm {voucherCode.discount}%</Typography>
        </Box>
      )}

      <Button variant="contained" color="success" fullWidth onClick={handleCheckout}>Thanh toán</Button>
    </Container>
  );
};

export default CheckoutPage;
