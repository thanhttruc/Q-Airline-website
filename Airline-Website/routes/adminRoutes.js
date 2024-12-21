const express = require('express');
const router = express.Router();
const multer = require('multer');
// const { generatePromotionPage } = require('../utils/promotionUtils');


const { getVoucherByCode, updateVoucherStatus, getAllVouchers, addVoucher, deleteVoucher } = require('../models/voucherModel');


const { createPromotion, getPromotionByUrl } = require('../models/promotionModel'); 
const locationModel = require('../models/locationModel'); 
const airplaneModel = require('../models/airplaneModel');
const { createPrice, updatePrice, updatePriceByFlightAndTicketType} = require('../models/priceModel');
const orderModel = require('../models/orderModel');  // Import model

// Cấu hình multer để lưu trữ ảnh
const storage = multer.memoryStorage();  // Lưu ảnh trong bộ nhớ dưới dạng Buffer
const upload = multer({ storage: storage });

router.post('/admin/create-html', (req, res) => {
  const { descriptionHTML } = req.body;

  if (!descriptionHTML) {
    return res.status(400).json({ message: 'Nội dung mô tả không hợp lệ' });
  }

  try {
    const timestamp = Date.now();
    const fileName = `promotion_${timestamp}.html`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    fs.writeFileSync(filePath, descriptionHTML);

    const pageUrl = `/uploads/${fileName}`;
    res.json({ pageUrl });

  } catch (error) {
    console.error('Error creating HTML file:', error);
    res.status(500).json({ message: 'Không thể tạo trang mô tả' });
  }
});


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

  let { id } = req.params;  // Lấy ID từ tham số URL
  // Nếu không có ID trong URL, kiểm tra trong request body
  if (!id && req.body && req.body.id) {
    id = req.body.id;
  }
  try {
    const result = await airplaneModel.deleteAirplane(id); // Xóa máy bay theo ID
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Xóa máy bay thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy máy bay để xóa' });
    }
  } catch (error) {
    console.error(error);
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
router.post('/promotions', async (req, res) => {
  const { title, description, start_date, end_date, image } = req.body; // Lấy dữ liệu từ yêu cầu

  console.log('Data received in POST request:', req.body);

  // Kiểm tra dữ liệu đầu vào
  if (!title || !description || !start_date || !end_date || !image) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Tạo ID cho khuyến mãi
    const promotionId = Date.now();  // Tạo id tạm thời cho khuyến mãi
    const descriptionURL = `http://localhost:3002/admin/promotion/${promotionId}`;  // Tạo link mô tả

    // Gửi dữ liệu khuyến mãi vào cơ sở dữ liệu
    const promotion = await createPromotion({
      title,
      description: descriptionURL,  // Mô tả dưới dạng URL
      start_date,
      end_date,
      image // Lưu URL ảnh
    });

    // Trả về thông tin khuyến mãi vừa được tạo
    res.status(201).json({
      message: 'Khuyến mãi đã được đăng thành công',
      promotion: {
        id: promotion.id,
        title: promotion.title,
        description: descriptionURL,  // Mô tả là URL
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        image: promotion.image // Đây là URL hình ảnh đã được gửi
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

// Route to serve dynamic promotion page by description (URL)
router.get('/promotion/:description', async (req, res) => {
  const { description } = req.params; // Description is the URL we stored in the database

  try {
    const promotion = await getPromotionByUrl(description); // Fetch promotion from DB by description
    if (promotion) {
      const { title, start_date, end_date, image, id } = promotion;

      // Check if the HTML file exists (optional: this depends on how you store the HTML)
      const promotionFilePath = path.join(__dirname, '..', 'promotion_pages', `${id}.html`);
      
      if (fs.existsSync(promotionFilePath)) {
        // If the HTML file exists, serve it
        const htmlContent = fs.readFileSync(promotionFilePath, 'utf8');  // Read the HTML file
        res.send(htmlContent);
      } else {
        // If the file doesn't exist, generate the HTML dynamically and serve it
        const htmlContent = generatePromotionPage(title, start_date, end_date, image);
        res.send(htmlContent);
      }
    } else {
      res.status(404).send('<h1>Promotion not found</h1>');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
});
// Lấy tất cả vouchers

// Cập nhật trạng thái voucher
router.put('/vouchers/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const result = await updateVoucherStatus(id, status);
  if (result.success) {
    res.status(200).json({ message: 'Voucher status updated successfully' });
  } else {
    res.status(404).json({ message: result.message || 'Voucher not found' });
  }
});

// Lấy tất cả vouchers
router.get('/vouchers', async (req, res) => {
  try {
    const vouchers = await getAllVouchers();
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Error getting all vouchers' });
  }
});

// Thêm voucher mới
// Thêm voucher mới
router.post('/vouchers', async (req, res) => {
  const { code, discount, expiration_date } = req.body;

  if (!code || !discount || !expiration_date) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const newVoucher = await addVoucher({ code, discount, expiration_date });
    res.status(201).json(newVoucher); // Trả về toàn bộ voucher vừa thêm vào
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding voucher.' });
  }
});


// Xóa voucher
router.delete('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received DELETE request for voucher ID: ${id}`);

  try {
    const result = await deleteVoucher(id); // Gọi hàm xóa trong model
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({ message: 'Failed to delete voucher' });
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