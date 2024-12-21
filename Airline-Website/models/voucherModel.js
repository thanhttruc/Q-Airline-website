const { connectDB } = require('../config/db');

// Get a voucher by its code
async function getVoucherByCode(voucherCode) {
    const connection = await connectDB();
    const [rows] = await connection.query(
        'SELECT * FROM vouchers WHERE code = ? AND status = "Active" AND expiration_date > NOW()',
        [voucherCode]
    );
    return rows.length > 0 ? rows[0] : null;
}



// Get all vouchers
async function getAllVouchers() {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM vouchers');
    return rows; // Return all vouchers in the table
}

// Update voucher status
async function updateVoucherStatus(voucherCode, newStatus) {
  const connection = await connectDB();
  const [result] = await connection.query(
      'UPDATE vouchers SET status = ? WHERE code = ?',
      [newStatus, voucherCode]
  );
  return result.affectedRows > 0; // Returns true if a row was updated
}

// Add a new voucher
// Add a new voucher
async function addVoucher(voucherData) {
  const connection = await connectDB();
  const { code, discount, expiration_date } = voucherData;

  // Chèn voucher mới vào cơ sở dữ liệu
  const result = await connection.query(
    'INSERT INTO vouchers (code, discount, expiration_date, status) VALUES (?, ?, ?, "Active")',
    [code, discount, expiration_date]
  );

  // Trả về toàn bộ thông tin của voucher vừa được thêm
  return {
    id: result.insertId,
    code,
    discount,
    expiration_date,
    status: 'Active', // Trạng thái mặc định là 'Active'
  };
}


// Delete a voucher by its code
async function deleteVoucher(id) {
  const connection = await connectDB();
  try {
    const [result] = await connection.query('DELETE FROM vouchers WHERE id = ?', [id]);
    return result;
  } catch (error) {
    throw new Error('Error deleting voucher: ' + error.message);
  } finally {
    connection.end();
  }
}

module.exports = {
    getVoucherByCode,
    updateVoucherStatus,
    getAllVouchers,
    addVoucher,
    deleteVoucher
};