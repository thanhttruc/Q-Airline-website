const { connectDB } = require('../config/db');

//Lấy tất cả promotions để hiển thị

async function getAllPromotions() {
  const connection = await connectDB();  
  const [rows] = await connection.query('SELECT * FROM promotions');  

  if (rows.length === 1) {
    return rows[0];  
  } else if (rows.length > 1) {
    const promotionsObj = {};  
    rows.forEach(promotion => {
      promotionsObj[promotion.id] = promotion; 
    });
    return promotionsObj; 
  } else {
    return {};  // Nếu không có khuyến mãi nào, trả về đối tượng rỗng
  }
}

async function createPromotion(promotionData) {
  const connection = await connectDB();
  const { title, description, start_date, end_date, image } = promotionData;

  try {
    // Nếu image là Buffer (hình ảnh được tải lên dưới dạng nhị phân), lưu trực tiếp
    const result = await connection.query(
      'INSERT INTO promotions (title, description, start_date, end_date, image) VALUES (?, ?, ?, ?, ?)',
      [title, description, start_date, end_date, image]
    );

    return result[0];  // Trả về kết quả chèn dữ liệu
  } catch (error) {
    throw error;
  }
}


async function updatePromotion(promotionId, promotionData) {
  const connection = await connectDB();
  const { title, description, start_date, end_date, image, status } = promotionData;

  const result = await connection.query(
    'UPDATE promotions SET title = ?, description = ?, start_date = ?, end_date = ?, image = ?, status = ? WHERE id = ?',
    [title, description, start_date, end_date, image, status, promotionId]
  );

  return result[0]; // Trả về kết quả cập nhật dữ liệu
}

async function deletePromotion(promotionId) {
  const connection = await connectDB();

  const result = await connection.query(
    'DELETE FROM promotions WHERE id = ?',
    [promotionId]
  );

  return result[0]; // Trả về kết quả xóa dữ liệu
}


module.exports = { getAllPromotions, createPromotion,  updatePromotion, deletePromotion};
