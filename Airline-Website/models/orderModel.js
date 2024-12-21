const { connectDB } = require('../config/db');

// Lấy danh sách tất cả đơn hàng
async function getAllOrders() {
  const connection = await connectDB();

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
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.order_date DESC
  `;

  try {
    const [rows] = await connection.query(query);
    const orders = rows.reduce((acc, row) => {
      if (!acc[row.order_id]) {
        acc[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          total_price: row.total_price,
          order_date: row.order_date,
          order_status: row.order_status,
          voucher_id: row.voucher_id,
          username: row.username,
          full_name: row.full_name,
          email: row.email,
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
    return Object.values(orders);
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách đơn hàng: ' + error.message);
  }
}

async function createOrder(userId, totalPrice, orderDetails, voucherCode) {
  const connection = await connectDB();
  try {
    // Kiểm tra voucher nếu có
    let voucherId = null;
    if (voucherCode) {
      const [voucher] = await connection.query(
        'SELECT * FROM vouchers WHERE code = ? AND status = "Active" AND expiration_date > NOW()',
        [voucherCode]
      );
      if (voucher.length > 0) {
        voucherId = voucher[0].id;
        totalPrice *= (1 - voucher[0].discount / 100);  // Giảm giá theo voucher
      } else {
        throw new Error('Voucher không hợp lệ hoặc đã hết hạn.');
      }
    }

    await connection.beginTransaction();

    // Tạo đơn hàng mới
    const [result] = await connection.query(
      'INSERT INTO orders (user_id, total_price, status, voucher_id) VALUES (?, ?, "Completed", ?)',
      [userId, totalPrice, voucherId]
    );
    const orderId = result.insertId;

    // Lặp qua các chi tiết đơn hàng để thêm vào bảng order_details
    for (const item of orderDetails) {
      // Lấy flight_id từ flight_code
      console.log(item.flight_code);
      const [flight] = await connection.query(
        'SELECT id FROM flights WHERE flight_code = ?',
        [item.flightCode] // flight_code có trong item từ location.state
      );
     
      if (flight.length === 0) {
        throw new Error(`Chuyến bay với mã ${item} không tồn tại.`);
      }

      const flightId = flight[0].id;

      // Thêm chi tiết đơn hàng vào bảng order_details
      await connection.query(
        'INSERT INTO order_details (order_id, flight_id, ticket_type_id, quantity, price_id) VALUES (?, ?, ?, ?, ?)',
        [orderId, flightId, item.ticketTypeId, item.quantity, item.priceId]
      );
      // Cập nhật số ghế
      const [airplaneId] = await connection.query(
        'SELECT * FROM flights WHERE flight_code = ? ',
        [item.flightCode]
      );
      await connection.query(
        
          'UPDATE airplanes SET seat_count = seat_count - ? WHERE id = ?',
          [item.quantity, airplaneId[0].airplane_id]
        );
    }

    await connection.commit();
    return { orderId, totalPrice, orderDetails };
  } catch (error) {
    await connection.rollback();
    throw new Error('Lỗi khi tạo đơn hàng: ' + error.message);
  }
}



// Lấy chi tiết đơn hàng theo user_id
async function getOrderDetailsByUserId(userId) {
  const connection = await connectDB();

  try {
    const query = `
      SELECT 
        o.id AS order_id, o.total_price, o.status, od.quantity, p.price, 
        f.flight_code, f.departure_time, f.arrival_time, t.name AS ticket_type_name
      FROM orders o
      LEFT JOIN order_details od ON o.id = od.order_id
      LEFT JOIN flights f ON od.flight_id = f.id
      LEFT JOIN ticket_types t ON od.ticket_type_id = t.id
      LEFT JOIN prices p ON od.price_id = p.id
      WHERE o.user_id = ?
    `;

    const [rows] = await connection.query(query, [userId]);
    if (rows.length === 0) {
      return null;
    }

    return rows.reduce((acc, row) => {
      if (!acc[row.order_id]) {
        acc[row.order_id] = {
          order_id: row.order_id,
          status: row.status,
          total_price: row.total_price,
          flight_details: []
        };
      }
      acc[row.order_id].flight_details.push({
        flight_code: row.flight_code,
        departure_time: row.departure_time,
        arrival_time: row.arrival_time,
        ticket_type_name: row.ticket_type_name,
        quantity: row.quantity,
        price: row.price,
        total_price: row.price * row.quantity
      });
      return acc;
    }, {});
  } catch (error) {
    throw new Error('Lỗi khi lấy chi tiết đơn hàng: ' + error.message);
  }
}

module.exports = { getAllOrders, createOrder, getOrderDetailsByUserId };
