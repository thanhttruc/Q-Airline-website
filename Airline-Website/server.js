const express = require('express');
const session = require('express-session');

const multer = require('multer');


const app = express();
const path = require('path');
const { createDefaultAdmin } = require('./models/userModel');
const flightRoutes = require('./routes/flightRoutes');
const userRoutes = require('./routes/userRoutes');   // Thêm route người dùng
const adminRoutes = require('./routes/adminRoutes'); 

const { connectDB } = require('./config/db');
const { clearData } = require('./utils/clearData');  // Thêm clearData

// Middleware để parse JSON
// Cấu hình body-parser để xử lý các yêu cầu có payload lớn hơn
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Cấu hình thư mục tải ảnh (tùy chỉnh đường dẫn nếu cần)
const upload = multer({
  dest: 'uploads/', // Lưu ảnh vào thư mục "uploads"
  limits: { fileSize: 50 * 1024 * 1024 },  // Giới hạn kích thước ảnh là 50MB
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại file (ví dụ chỉ cho phép hình ảnh)
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Chỉ cho phép tải lên ảnh'));
    }
  }
});

// Tải ảnh lên server
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Không có file được tải lên.' });
  }
  res.status(200).send({ message: 'Tải ảnh thành công!', file: req.file });
});

// Cấu hình Express để phục vụ các tệp tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình session
app.use(session({
  secret: 'your_secret_key',  
  resave: false,
  saveUninitialized: true
}));
const cors = require('cors');

// Sử dụng CORS cho phép frontend trên localhost:3002 truy cập backend trên localhost:3000
app.use(cors({
  origin: 'http://localhost:3002',  
  credentials: true, 
  methods: ['GET', 'POST', 'OPTIONS'],  
}));

// Xử lý preflight request (OPTIONS)
app.options('*', cors());  // Tất cả các route đều hỗ trợ OPTIONS

// Route trả về trang login (login.html)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
  });
// Route trả về trang home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  });
//Route trả về trang promotion
app.get('/promotions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'promotions.html'));
});

// Route hiển thị trang đăng khuyến mãi (admin)
app.get('/admin/promotions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin_promotions.html'));
});

  

// Đăng ký các route
app.use('/api', flightRoutes);
app.use('/api/users', userRoutes); 
app.use('/admin', adminRoutes);


// Route để kiểm tra quyền truy cập vào admin
app.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
      res.send('Chào admin!');
    } else {
      res.status(403).send('Không có quyền truy cập');
    }
  });
  
  // Route trang user dashboard (dành cho tất cả người dùng đã đăng nhập)
  app.get('/user-dashboard', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    res.send(`Chào ${req.session.user.username}, đây là trang người dùng.`);
  });

// Khởi động server
const port = 3000;
(async () => {
    const connection = await connectDB();
    await createDefaultAdmin();  // Tạo tài khoản admin nếu chưa có
    console.log('Database connected and default admin created!');
  })();
  
 // Khởi tạo server và lưu đối tượng server vào biến
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Lắng nghe tín hiệu SIGINT để dọn dẹp dữ liệu và đóng server
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Clearing data and shutting down...');
  
  try {
    await clearData();  // Gọi hàm xóa dữ liệu
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);  // Thoát chương trình bình thường
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    server.close(() => {
      process.exit(1);  // Thoát chương trình với mã lỗi nếu có lỗi
    });
  }
});