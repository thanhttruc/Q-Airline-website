const { connectDB } = require('../config/db');
const fs = require('fs');
const path = require('path');
// const { generatePromotionPage } = require('../utils/promotionUtils');

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
  const connection = await connectDB();  // Kết nối đến cơ sở dữ liệu
  const { title, description, start_date, end_date, image } = promotionData;  // Lấy dữ liệu từ promotionData

  try {
    // Thực thi câu lệnh SQL để chèn dữ liệu vào bảng promotions
    const result = await connection.query(
      'INSERT INTO promotions (title, description, start_date, end_date, image) VALUES (?, ?, ?, ?, ?)',
      [title, description, start_date, end_date, image]  // Truyền các giá trị vào câu lệnh SQL
    );

    return result[0];  // Trả về kết quả chèn dữ liệu
  } catch (error) {
    // Nếu có lỗi xảy ra, ném lỗi để xử lý ngoài hàm
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

// Lấy chi tiết promotion dựa trên URL mô tả
async function getPromotionByUrl(descriptionUrl) {
  const connection = await connectDB();
  const [rows] = await connection.query('SELECT * FROM promotions WHERE description = ?', [descriptionUrl]);

  if (rows.length > 0) {
    return rows[0];
  }
  return null; // Nếu không tìm thấy promotion theo URL
}


module.exports = { getAllPromotions, createPromotion,  updatePromotion, deletePromotion, getPromotionByUrl};