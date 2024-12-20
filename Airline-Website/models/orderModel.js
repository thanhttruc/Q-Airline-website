const { connectDB } = require('../config/db');

async function getAllOrders() {
  const connection = await connectDB();

  // Truy vấn tất cả các đơn hàng và kết hợp với các chi tiết đơn hàng và thông tin người dùng
  const query = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      o.total_price,
      o.order_date,
      o.status AS order_status,
      o.voucher_id,
      od.id AS order_detail_id,
      od.flight_id,
      od.ticket_type_id,
      od.quantity,
      od.price_id,
      f.flight_code,
      f.departure_time,
      f.arrival_time,
      t.name AS ticket_type_name,
      p.price,
      u.username,
      u.full_name,
      u.email
    FROM orders o
    LEFT JOIN order_details od ON o.id = od.order_id
    LEFT JOIN flights f ON od.flight_id = f.id
    LEFT JOIN ticket_types t ON od.ticket_type_id = t.id
    LEFT JOIN prices p ON od.price_id = p.id
    LEFT JOIN users u ON o.user_id = u.id  -- Join with users table to get user info
    ORDER BY o.order_date DESC
  `;

  const [rows] = await connection.query(query);

  // Tổ chức dữ liệu theo order_id và trả về kết quả
  const orders = rows.reduce((acc, row) => {
    if (!acc[row.order_id]) {
      acc[row.order_id] = {
        order_id: row.order_id,
        user_id: row.user_id,
        total_price: row.total_price,
        order_date: row.order_date,
        order_status: row.order_status,
        voucher_id: row.voucher_id,
        username: row.username,  // Add username
        full_name: row.full_name,  // Add full_name
        email: row.email,  // Add email
        order_details: []
      };
    }

    acc[row.order_id].order_details.push({
      order_detail_id: row.order_detail_id,
      flight_id: row.flight_id,
      ticket_type_id: row.ticket_type_id,
      quantity: row.quantity,
      price_id: row.price_id,
      flight_code: row.flight_code,
      departure_time: row.departure_time,
      arrival_time: row.arrival_time,
      ticket_type_name: row.ticket_type_name,
      price: row.price
    });

    return acc;
  }, {});

  return Object.values(orders); // Trả về mảng các đơn hàng
}

async function createOrder(userId, totalPrice, orderDetails, voucherCode) {
  const connection = await connectDB();
  // Kiểm tra voucher nếu có
  let voucherId = null;
  if (voucherCode) {
    const [voucher] = await connection.query(
      'SELECT * FROM vouchers WHERE code = ? AND status = "Active" AND expiration_date > NOW()',
      [voucherCode]
    );
    if (voucher.length > 0) {
      voucherId = voucher[0].id;
      totalPrice *= (1 - voucher[0].discount / 100);  // Áp dụng giảm giá từ voucher
    }
  }
  const result = await connection.query(
    'INSERT INTO orders (user_id, total_price, status, voucher_id) VALUES (?, ?, "Pending", ?)',
    [userId, totalPrice, voucherId]
  );
  const orderId = result[0].insertId;
  // Thêm chi tiết đơn hàng vào bảng order_details
  for (const item of orderDetails) {
    await connection.query(
      'INSERT INTO order_details (order_id, flight_id, ticket_type_id, quantity, price_id) VALUES (?, ?, ?, ?, ?)',
      [orderId, item.flightId, item.ticketTypeId, item.quantity, item.priceId]
    );
  }
  return { orderId, totalPrice, orderDetails };
}
async function getOrderDetailsByUserId(user_id) {
  const connection = await connectDB();
  
  // Truy vấn lấy thông tin đơn hàng của người dùng
  const [orders] = await connection.query('SELECT * FROM orders WHERE user_id = ?', [user_id]);
  
  if (orders.length === 0) {
    return null;  // Không tìm thấy đơn hàng của người dùng
  }

  // Lấy chi tiết đơn hàng
  const orderDetails = [];
  for (let order of orders) {
    const [details] = await connection.query('SELECT * FROM order_details WHERE order_id = ?', [order.id]);
    
    // Duyệt qua các chi tiết đơn hàng và lấy thông tin chuyến bay, loại vé, giá
    const detailWithFlightInfo = await Promise.all(details.map(async (detail) => {
      const [flight] = await connection.query('SELECT * FROM flights WHERE id = ?', [detail.flight_id]);
      const [ticketType] = await connection.query('SELECT * FROM ticket_types WHERE id = ?', [detail.ticket_type_id]);
      const [price] = await connection.query('SELECT * FROM prices WHERE flight_id = ? AND ticket_type_id = ?', [detail.flight_id, detail.ticket_type_id]);
      
      return {
        flight: {
          flight_code: flight[0].flight_code,
          departure_location: flight[0].departure_location_id,  // Bạn có thể tham chiếu đến bảng locations nếu cần
          arrival_location: flight[0].arrival_location_id,
          departure_time: flight[0].departure_time,
          arrival_time: flight[0].arrival_time,
          airline: flight[0].airline,
        },
        ticket: {
          type: ticketType[0].name,
          description: ticketType[0].description,
          price: price[0].price,
          quantity: detail.quantity,
          total_price: price[0].price * detail.quantity,
        }
      };
    }));

    orderDetails.push({
      order_id: order.id,
      status: order.status,
      total_price: order.total_price,
      flight_details: detailWithFlightInfo
    });
  }

  return orderDetails;
}

module.exports = { getAllOrders, getOrderDetailsByUserId,createOrder };
