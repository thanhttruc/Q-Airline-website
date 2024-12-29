import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, List, ListItem, Paper } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './cartpage.css';

const CartPage = () => {
  const { cart, getTotalPrice, clearCart, applyVoucher } = useCart();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    // Cập nhật tổng tiền ban đầu từ CartContext
    setTotalPrice(getTotalPrice());

    // Fetch các voucher còn hiệu lực
    fetch('http://localhost:3000/admin/vouchers')
      .then((response) => response.json())
      .then((data) => {
        const activeVouchers = data.filter((voucher) => voucher.status === 'Active');
        setVouchers(activeVouchers);
      })
      .catch((error) => console.error('Error fetching vouchers:', error));
  }, [cart, getTotalPrice]);

  // Xử lý khi người dùng chọn hoặc bỏ chọn voucher
  const handleVoucherClick = (voucher) => {
    if (selectedVoucher?.id === voucher.id) {
      // Nếu voucher đã chọn, bỏ chọn voucher và cập nhật lại totalPrice
      setSelectedVoucher(null);
      setTotalPrice(getTotalPrice());
      applyVoucher(0); // Đặt lại discount thành 0 nếu không chọn voucher
    } else {
      // Nếu chưa chọn, chọn voucher và áp dụng discount
      setSelectedVoucher(voucher);
      applyVoucher(voucher.discount); // Áp dụng voucher và cập nhật tổng tiền
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Giỏ hàng của bạn hiện tại trống!');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    setTotalPrice(0); // Reset tổng tiền khi giỏ hàng bị xóa
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Giỏ hàng của bạn</Typography>
      
      <Box mb={3}>
        <List>
          {cart.map((item, index) => (
            <ListItem key={index} divider>
              <Box sx={{ width: '100%' }}>
                <Typography variant="h6">{item.flight.flight_code}</Typography>
                <Typography variant="body1"><strong>Loại vé:</strong> {item.flight.tickets[0].type}</Typography>
                <Typography variant="body1"><strong>Số lượng:</strong> {item.quantity}</Typography>
                <Typography variant="body1"><strong>Giá:</strong> {item.ticketPrice.toLocaleString()} VND</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box my={2}>
        <Typography variant="h6"><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND</Typography>
      </Box>

      {/* Voucher Section */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>Áp dụng Voucher</Typography>
        <Paper elevation={3}>
          <List>
            {vouchers.map((voucher) => (
              <ListItem 
                key={voucher.id} 
                button 
                selected={selectedVoucher?.id === voucher.id}
                onClick={() => handleVoucherClick(voucher)}
                divider
              >
                <Typography variant="body1">{`${voucher.code} - Giảm ${voucher.discount}%`} </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Box my={2} display="flex" justifyContent="space-between">
        <Button variant="contained" color="error" onClick={handleClearCart}>Xóa giỏ hàng</Button>
        <Button variant="contained" color="success" onClick={handleCheckout}>Thanh toán</Button>
      </Box>
    </Container>
  );
};

export default CartPage;
