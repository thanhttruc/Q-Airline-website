const { connectDB } = require('../config/db');

// Hàm lấy tất cả máy bay
async function getAllAirplanes() {
    const connection = await connectDB();  
    const [rows] = await connection.query('SELECT * FROM airplanes');  
  
    if (rows.length === 1) {
      return rows[0];  
    } else if (rows.length > 1) {
      const airplanesObj = {};  
      rows.forEach(airplane => {
        airplanesObj[airplane.id] = airplane;  
      });
      return airplanesObj; 
    } else {
      return {};  
    }
  }



// Hàm lấy máy bay theo ID
async function getAirplaneById(id) {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM airplanes WHERE id = ?', [id]);
  
    if (rows.length === 1) {
      return rows[0]; 
    } else {
      return null;  
    }
  }

// Hàm tạo máy bay mới
async function createAirplane(airplaneData) {
    const connection = await connectDB();
    const { airplane_code, manufacturer, model, seat_count, description } = airplaneData;
  
    const result = await connection.query(
      'INSERT INTO airplanes (airplane_code, manufacturer, model, seat_count, description) VALUES (?, ?, ?, ?, ?)',
      [airplane_code, manufacturer, model, seat_count, description]
    );
  
    return result[0]; // Trả về kết quả chèn dữ liệu
  }

// Hàm cập nhật máy bay theo ID
async function updateAirplane(id, airplaneData) {
    const connection = await connectDB();
    const { airplane_code, manufacturer, model, seat_count, description } = airplaneData;
  
    const result = await connection.query(
      'UPDATE airplanes SET airplane_code = ?, manufacturer = ?, model = ?, seat_count = ?, description = ? WHERE id = ?',
      [airplane_code, manufacturer, model, seat_count, description, id]
    );
  
    if (result.affectedRows === 1) {
      return { message: 'Cập nhật thành công' };
    } else {
      return { message: 'Không tìm thấy máy bay để cập nhật' };
    }
  }

// Hàm xóa máy bay theo ID
async function deleteAirplane(id) {
  const connection = await connectDB();

  try {
    // Tắt kiểm tra khóa ngoại để bỏ qua ràng buộc khóa ngoại
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Xóa các chuyến bay có liên quan đến máy bay (hoặc set NULL nếu bạn muốn)
    await connection.query('DELETE FROM flights WHERE airplane_id = ?', [id]);

    // Xóa máy bay
    const result = await connection.query('DELETE FROM airplanes WHERE id = ?', [id]);

    if (result.affectedRows === 1) {
      // Re-enable foreign key checks
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      return { message: 'Xóa máy bay thành công' };
    } else {
      // Re-enable foreign key checks
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      return { message: 'Không tìm thấy máy bay để xóa' };
    }
  } catch (error) {
    console.error('Lỗi khi xóa máy bay:', error);
    // Ensure foreign key checks are re-enabled even in case of an error
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    return { message: 'Có lỗi xảy ra khi xóa máy bay' };
  }
}

  
  module.exports = {
    getAllAirplanes,
    getAirplaneById,
    createAirplane,
    updateAirplane,
    deleteAirplane,
  };
  
  