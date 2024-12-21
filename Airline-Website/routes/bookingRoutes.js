const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder, getOrderDetailsByUserId } = require('../models/orderModel');
const { connectDB } = require('../config/db');
// Lấy tất cả các đơn hàng
router.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);  // Trả về danh sách đơn hàng
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
});

// Tạo đơn hàng mới (booking) cho userId (thay đổi route thành /:user_id)
router.post('/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  const { totalPrice, orderDetails, voucherCode } = req.body;

  if (!userId || !totalPrice || !Array.isArray(orderDetails) || orderDetails.length === 0) {
    return res.status(400).json({ message: 'Thiếu dữ liệu cần thiết để tạo đơn hàng.' });
  }

  try {
    const connection = await connectDB();
    const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const order = await createOrder(userId, totalPrice, orderDetails, voucherCode);
    res.status(201).json({
      message: 'Đơn hàng đã được tạo thành công',
      order: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
});

// Lấy chi tiết đơn hàng theo user_id
router.get('/user/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    const orderDetails = await getOrderDetailsByUserId(userId);

    if (!orderDetails) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng của người dùng này' });
    }

    res.status(200).json(orderDetails);  // Trả về chi tiết đơn hàng
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin chi tiết đơn hàng' });
  }
});

module.exports = router;