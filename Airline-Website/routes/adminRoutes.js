const express = require('express');
const router = express.Router();
const multer = require('multer');


const { createPromotion } = require('../models/promotionModel'); 
const locationModel = require('../models/locationModel'); 
const airplaneModel = require('../models/airplaneModel');
const { createPrice, updatePrice, updatePriceByFlightAndTicketType} = require('../models/priceModel');
const orderModel = require('../models/orderModel');  // Import model

// Cấu hình multer để lưu trữ ảnh
const storage = multer.memoryStorage();  // Lưu ảnh trong bộ nhớ dưới dạng Buffer
const upload = multer({ storage: storage });




//Prices
router.post('/prices', async (req, res) => {
  const priceData = req.body;

  try {
    const result = await createPrice(priceData);
    res.status(201).json({ message: 'Thêm giá vé thành công', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi thêm giá vé.' });
  }
});

router.put('/prices/:id', async (req, res) => {
  const { id } = req.params;
  const priceData = req.body;

  try {
    const result = await updatePrice(id, priceData);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật giá vé.' });
  }
});

// API cập nhật giá vé
router.put('/prices/:flightId/:ticketTypeId', async (req, res) => {
  const { flightId, ticketTypeId } = req.params;
  const { newPrice } = req.body;

  if (!newPrice) {
    return res.status(400).json({ message: 'Bạn phải cung cấp giá mới' });
  }

  try {
    // Cập nhật giá vé theo flightId và ticketTypeId
    const result = await updatePriceByFlightAndTicketType(flightId, ticketTypeId, newPrice);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy giá vé để cập nhật' });
    }

    res.status(200).json({ message: 'Cập nhật giá vé thành công', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật giá vé' });
  }
});


// API để tạo một máy bay mới
router.post('/airplanes', async (req, res) => {
  const airplaneData = req.body;
  try {
    const result = await airplaneModel.createAirplane(airplaneData); // Tạo máy bay mới
    res.status(201).json({ message: 'Máy bay được tạo thành công', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo máy bay.' });
  }
});

// API để cập nhật máy bay
router.put('/airplanes/:id', async (req, res) => {
  const { id } = req.params;
  const airplaneData = req.body;
  try {
    const result = await airplaneModel.updateAirplane(id, airplaneData); // Cập nhật máy bay theo ID
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Cập nhật máy bay thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy máy bay để cập nhật' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật máy bay.' });
  }
});

// API để xóa máy bay
router.delete('/airplanes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await airplaneModel.deleteAirplane(id); // Xóa máy bay theo ID
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Xóa máy bay thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy máy bay để xóa' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa máy bay.' });
  }
});


// API to add a new location
router.post('/locations', async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required.' });
  }

  try {
    const newLocation = await locationModel.createLocation({ name, description });
    res.status(201).json({ message: 'Location added successfully.', location: newLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding location.' });
  }
});

// API to update a location by ID
router.put('/locations/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required.' });
  }

  try {
    const updatedLocation = await locationModel.updateLocation(id, { name, description });
    if (updatedLocation.affectedRows === 0) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json({ message: 'Location updated successfully.', location: { id, name, description } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating location.' });
  }
});

// API to delete a location by ID
router.delete('/locations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await locationModel.deleteLocation(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json({ message: 'Location deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting location.' });
  }
});


// Route xử lý đăng bài khuyến mại
// Route xử lý đăng bài khuyến mãi
// Route xử lý đăng bài khuyến mãi
router.post('/promotions', upload.single('image'), async (req, res) => {
  const { title, description, start_date, end_date } = req.body;
  const image = req.file ? req.file.buffer : null;  // Lấy buffer ảnh từ yêu cầu tải lên

  console.log('Data received in POST request:', req.body);

  // Kiểm tra dữ liệu đầu vào
  if (!title || !description || !start_date || !end_date) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Tạo HTML cho mô tả với liên kết (nếu có ID khuyến mãi)
    const promotionId = Date.now();  // Tạo id tạm thời cho khuyến mãi
    const descriptionHTML = `<a href="http://localhost:3002/promotion/${promotionId}">${description}</a>`;  // Tạo liên kết cho mô tả

    // Gọi hàm tạo khuyến mãi với mô tả đã chuyển thành HTML
    const promotion = await createPromotion({
      title,
      description: descriptionHTML,  // Gửi mô tả dưới dạng HTML
      start_date,
      end_date,
      image // Dữ liệu ảnh sẽ là Buffer nếu người dùng tải ảnh lên
    });

    // Trả về thông tin khuyến mãi vừa được tạo
    res.status(201).json({
      message: 'Khuyến mãi đã được đăng thành công',
      promotion: {
        id: promotion.id,
        title: promotion.title,
        description: promotion.description,  // Mô tả sẽ là HTML với liên kết
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        image: promotion.image ? 'data:image/jpeg;base64,' + promotion.image.toString('base64') : null // Nếu có ảnh thì chuyển thành Base64
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi đăng khuyến mãi', error: error.message });
  }
});
// Route xử lý cập nhật bài khuyến mại
router.put('/promotions/:id', async (req, res) => {
  const promotionId = req.params.id;
  const { title, description, start_date, end_date, image, status } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!title || !description || !start_date || !end_date || !status) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Gọi hàm cập nhật khuyến mãi
    const updatedPromotion = await updatePromotion(promotionId, { title, description, start_date, end_date, image, status });

    if (updatedPromotion.affectedRows > 0) {
      res.status(200).json({ message: 'Khuyến mãi đã được cập nhật thành công', promotionId });
    } else {
      res.status(404).json({ message: 'Không tìm thấy khuyến mãi để cập nhật' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật khuyến mãi', error: error.message });
  }
});
// Route xử lý xóa bài khuyến mại
router.delete('/promotions/:id', async (req, res) => {
  const promotionId = req.params.id;

  try {
    // Gọi hàm xóa khuyến mãi
    const result = await deletePromotion(promotionId);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Khuyến mãi đã được xóa thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy khuyến mãi để xóa' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa khuyến mãi', error: error.message });
  }
});


//Route admin orders
// API để lấy tất cả các đơn hàng của khách hàng và chi tiết
router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();  // Lấy tất cả các đơn hàng và chi tiết
    res.status(200).json(orders);  // Trả về kết quả dưới dạng JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng.' });
  }
});



module.exports = router;