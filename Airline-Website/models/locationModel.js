const { connectDB } = require('../config/db');

// Hàm lấy tất cả địa điểm
async function getAllLocations() {
  const connection = await connectDB();
  const [rows] = await connection.query('SELECT * FROM locations');  

  if (rows.length === 1) {
    return rows[0];  
  } else if (rows.length > 1) {
    const locationsObj = {};  
    rows.forEach(location => {
      locationsObj[location.id] = location; 
    });
    return locationsObj; 
  } else {
    return {};  // Nếu không có địa điểm nào, trả về đối tượng rỗng
  }
}

// Hàm thêm một địa điểm mới
async function createLocation(locationData) {
  const connection = await connectDB();
  const { name, description } = locationData;

  const result = await connection.query(
    'INSERT INTO locations (name, description) VALUES (?, ?)',
    [name, description]
  );

  return result[0]; // Trả về kết quả chèn dữ liệu
}

// Hàm lấy một địa điểm theo ID
async function getLocationById(id) {
  const connection = await connectDB();
  const [rows] = await connection.query('SELECT * FROM locations WHERE id = ?', [id]);

  if (rows.length === 1) {
    return rows[0];  // Trả về địa điểm nếu tìm thấy
  } else {
    return null;  // Không tìm thấy địa điểm
  }
}

// Hàm cập nhật địa điểm
async function updateLocation(id, locationData) {
  const connection = await connectDB();
  const { name, description } = locationData;

  const result = await connection.query(
    'UPDATE locations SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );

  return result[0]; // Trả về kết quả cập nhật dữ liệu
}

// Hàm xóa địa điểm
async function deleteLocation(id) {
  const connection = await connectDB();
  const result = await connection.query('DELETE FROM locations WHERE id = ?', [id]);

  return result[0]; // Trả về kết quả xóa dữ liệu
}


// Hàm tính toán số lần mỗi location xuất hiện trong đơn hàng
async function getLocationOrderCount() {
  const connection = await connectDB();

  try {
    // Truy vấn số lần mỗi location được chọn trong các đơn hàng
    const [rows] = await connection.query(`
      SELECT
        l.id AS location_id,
        l.name AS location_name,
        COUNT(DISTINCT od.order_id) AS order_count
      FROM locations l
      LEFT JOIN flights f ON f.departure_location_id = l.id OR f.arrival_location_id = l.id
      LEFT JOIN order_details od ON od.flight_id = f.id
      GROUP BY l.id
      ORDER BY order_count DESC;
    `);

    if (rows.length === 1) {
      return rows[0];  // Nếu chỉ có một location, trả về kết quả là đối tượng đơn
    } else if (rows.length > 1) {
      const locationsObj = {};  // Nếu có nhiều hơn một location, trả về đối tượng có id làm khóa
      rows.forEach(location => {
        locationsObj[location.location_id] = location;  // Dùng location_id làm khóa
      });
      return locationsObj;
    } else {
      return {};  // Nếu không có location nào, trả về đối tượng rỗng
    }
  } catch (error) {
    console.error("Error fetching location order count:", error);
    throw error;  // Ném lỗi nếu có sự cố
  }
}



module.exports = {
  getAllLocations,
  createLocation,
  getLocationById,
  updateLocation,
  deleteLocation,
  getLocationOrderCount,
};