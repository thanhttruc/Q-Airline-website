const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder, getOrderDetailsByUserId ,updateWhenCancelOrder} = require('../models/orderModel');
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

router.delete('/:user_id/:order_id', async (req, res) => {
  const userId = req.params.user_id;
  const orderId = req.params.order_id;

  console.log((userId), (orderId));


  if (!userId || !orderId) {
    return res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc đơn hàng để hủy.' });
  }

  try {
    const connection = await connectDB();
    
    // Kiểm tra xem người dùng có tồn tại không
    const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra xem đơn hàng có tồn tại không
    const [order] = await connection.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
    if (!order || order.length === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không phải của người dùng này.' });
    }

    // Kiểm tra trạng thái đơn hàng, chỉ hủy nếu chưa được xử lý
    // if (order[0].status === 'Pending') {
    //   return res.status(400).json({ message: 'Không thể hủy đơn hàng đã được xử lý hoặc giao hàng.' });
    // }
  
    // Tiến hành hủy đơn hàng
    await connection.query('UPDATE orders SET status = ? WHERE id = ?', ['Canceled', orderId]);
    await updateWhenCancelOrder(orderId);
    res.status(200).json({
      message: 'Đơn hàng đã được hủy thành công',
      orderId: orderId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi hủy đơn hàng', error: error.message });
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