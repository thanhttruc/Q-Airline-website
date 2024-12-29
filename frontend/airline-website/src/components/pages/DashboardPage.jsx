// src/pages/DashboardPage.jsx
import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemText, Paper } from '@mui/material';

const DashboardPage = () => {
  return (
    <Container>
      {/* Banner lướt chuyển động */}
      <Box
        sx={{
          backgroundColor: '#4CAF50',
          padding: 2,
          color: 'BluePowder',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          position: 'relative',
          height: 200, // Đặt chiều cao cho banner
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'slideIn 10s infinite', // Tạo hiệu ứng lướt
          backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/043/191/558/non_2x/airplane-side-view-flying-above-the-clouds-with-dramatic-sky-background-illustration-plane-with-sunset-concept-vector.jpg)', // Ảnh nền ngẫu nhiên
          '@keyframes slideIn': {
            '0%': {
              transform: 'translateX(100%)',
            },
            '50%': {
              transform: 'translateX(0)',
            },
            '100%': {
              transform: 'translateX(-100%)',
            },
          },
        }}
      >
        <Typography variant="h4" align="center" sx={{ padding: 2 }}>
          Chào mừng bạn đến với Dashboard của chúng tôi! Khám phá những công cụ hữu ích ngay bây giờ.
        </Typography>
      </Box>

      {/* Hướng dẫn sử dụng */}
      <Paper sx={{ marginTop: 4, padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Hướng Dẫn Sử Dụng
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Truy cập Quản lí điểm bay" secondary="Thêm, sửa, xóa địa điểm bay trong mục Quản lí điểm bay" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Đăng thông tin khuyến mại" secondary="Đăng bài khuyến mại và tạo voucher trong mục Khuyến mại" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Xem đơn đặt hàng" secondary="Truy cập vào mục 'Đơn hàng' để biết thêm về ứng dụng và hướng dẫn sử dụng." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Cập nhập mẫu máy bay" secondary="Truy cập vào mục 'Quản lí máy bay' để biết thêm về ứng dụng và hướng dẫn sử dụng." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Thông tin vé" secondary="Truy cập vào mục 'Quản lí vé đặt' để biết thêm về ứng dụng và hướng dẫn sử dụng." />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default DashboardPage;

