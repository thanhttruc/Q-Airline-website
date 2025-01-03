const express = require('express');
const router = express.Router();
const locationModel = require('../models/locationModel');
const ticketTypeModel = require('../models/ticketTypeModel');
const flightModel = require('../models/flightModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const airplaneModel = require('../models/airplaneModel');

const { getAllPrices, getPriceById, getPriceByFlightAndTicketType} = require('../models/priceModel');
router.get('/prices', async (req, res) => {
  try {
    const prices = await getAllPrices();
    res.status(200).json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách giá vé.' });
  }
});
router.get('/prices/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const price = await getPriceById(id);
    if (price) {
      res.status(200).json(price);
    } else {
      res.status(404).json({ message: 'Không tìm thấy giá vé với ID ' + id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy giá vé.' });
  }
});
// API lấy giá vé theo chuyến bay và loại vé
router.get('/prices/:flightId/:ticketTypeId', async (req, res) => {
  const { flightId, ticketTypeId } = req.params;
  
  try {
    const price = await getPriceByFlightAndTicketType(flightId, ticketTypeId);
    if (!price) {
      return res.status(404).json({ message: 'Không tìm thấy giá vé cho chuyến bay và loại vé này.' });
    }
    res.status(200).json(price);  // Trả về giá vé
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin giá vé.' });
  }
});

// Cập nhật trạng thái và thời gian khởi hành chuyến bay
// Cập nhật thời gian khởi hành và tự động thay đổi trạng thái thành "Delayed"
router.put('/flights/:flight_code', async (req, res) => {
  const { flight_code } = req.params;
  const { newDepartureTime } = req.body;  // Lấy thời gian khởi hành mới từ request

  try {
    // Cập nhật thời gian khởi hành và trạng thái chuyến bay trong DB
    const updatedFlight = await flightModel.updateFlightDepartureTime(flight_code, newDepartureTime);
    if (!updatedFlight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.status(200).json(updatedFlight);  // Trả về thông tin chuyến bay đã được cập nhật
  } catch (err) {
    console.error('Error updating flight:', err);
    res.status(500).json({ error: 'Failed to update flight' });
  }
});
// API để lấy tất cả máy bay
router.get('/airplanes', async (req, res) => {
  try {
    const airplanes = await airplaneModel.getAllAirplanes(); // Lấy tất cả máy bay
    res.status(200).json(airplanes); // Trả về danh sách máy bay dưới dạng JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách máy bay.' });
  }
});
// API để lấy một máy bay theo ID
router.get('/airplanes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const airplane = await airplaneModel.getAirplaneById(id); // Lấy máy bay theo ID
    if (airplane) {
      res.status(200).json(airplane); // Trả về máy bay dưới dạng JSON
    } else {
      res.status(404).json({ message: 'Không tìm thấy máy bay' }); // Nếu không tìm thấy máy bay
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin máy bay.' });
  }
});


// Endpoint để lấy danh sách địa điểm
router.get('/locations', async (req, res) => {
  const locations = await locationModel.getAllLocations();
  res.json(locations);
});

// API để lấy địa điểm theo ID (từ URL hoặc từ request body)
router.get('/locations', async (req, res) => {
  let { id } = req.params;  // Lấy ID từ tham số URL
  // Nếu không có ID trong URL, kiểm tra trong request body
  if (!id && req.body && req.body.id) {
    id = req.body.id;
  }
  // Kiểm tra nếu không có ID
  if (!id) {
    return res.status(400).json({ message: 'ID địa điểm không được cung cấp.' });
  }
  try {
    const location = await locationModel.getLocationById(id); 
    if (location) {
      res.status(200).json(location); 
    } else {
      res.status(404).json({ message: `Không tìm thấy địa điểm với ID: ${id}` }); 
    }
  } catch (error) {
    console.error('Lỗi khi lấy địa điểm theo ID:', error);
    res.status(500).json({ message: 'Lỗi khi lấy địa điểm theo ID.' }); 
  }
});


  // API để lấy số lần mỗi location xuất hiện trong đơn hàng
  router.get('/lcount', async (req, res) => {
    try {
      const locations = await locationModel.getLocationOrderCount();  // Gọi hàm getLocationOrderCount từ db
      res.json({ data: locations });  // Trả về dữ liệu với mảng các location và số lần chọn
    } catch (error) {
      console.error('Error fetching location order count:', error);
      res.status(500).json({ message: 'Error retrieving location order count' });
    }
  });

// Endpoint để lấy danh sách loại vé
router.get('/ticket-types', async (req, res) => {
  const ticketTypes = await ticketTypeModel.getAllTicketTypes();
  res.json(ticketTypes);
});

// Endpoint để lấy danh sách chuyến bay
router.get('/flights', async (req, res) => {
  const flights = await flightModel.getAllFlights();
  res.json(flights);
});

// Endpoint để lấy danh sách người dùng
// Route để lấy tất cả người dùng
router.get('/users', async (req, res) => {
    try {
      const users = await getAllUsers();  // Gọi hàm getAllUsers từ model
      res.json({ data: users });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users' });
    }
  });


  
  // Route để tạo người dùng mới
  router.post('/users', async (req, res) => {
    try {
      const newUser = await createUser(req.body);  // Gửi thông tin người dùng từ request body
      res.status(201).json({ data: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  });

// Endpoint để lấy danh sách đơn hàng
router.get('/orders', async (req, res) => {
  const orders = await orderModel.getAllOrders();
  res.json(orders);
});


router.get('/flights/:flight_code', async (req, res) => {
  const flightCode = req.params.flight_code;

  try {
    const flight = await flightModel.getFlightByCode(flightCode);

    if (flight) {
      res.json(flight);  // Trả về thông tin chuyến bay nếu có
    } else {
      res.status(404).json({ message: 'Chuyến bay không tìm thấy' });  // Nếu không có chuyến bay với flight_code đó
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống' });  // Lỗi hệ thống nếu có lỗi xảy ra
  }
});


module.exports = router;
