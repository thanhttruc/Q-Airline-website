import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'; 
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function ManageAirplanes() {
  const { user } = useContext(AuthContext);
  const [airplanes, setAirplanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAirplane, setSelectedAirplane] = useState(null);

  // Hàm lấy dữ liệu máy bay từ API
  const fetchAirplanes = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để thanh toán!');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/airplanes');  // Thay đổi endpoint nếu cần
      const data = await response.json();

      // Chuyển đối tượng máy bay thành mảng để dễ dàng render bảng
      const airplanesArray = Object.values(data);
      setAirplanes(airplanesArray);
    } catch (error) {
      console.error('Error fetching airplanes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchAirplanes khi component mount
  useEffect(() => {
    fetchAirplanes();
  }, []);

  // Mở modal để cập nhật máy bay
  const handleOpenDialog = (airplane) => {
    setSelectedAirplane(airplane);
    setOpenDialog(true);
  };

  // Đóng modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAirplane(null);
  };

  // Cập nhật máy bay thông qua API PUT
  const handleUpdateAirplane = async () => {
    if (selectedAirplane) {
      try {
        const response = await axios.put(`http://localhost:3000/admin/airplanes/${selectedAirplane.id}`, selectedAirplane);
        if (response.status === 200) {
          alert('Cập nhật máy bay thành công!');
          fetchAirplanes(); // Lấy lại danh sách máy bay
          handleCloseDialog();
        } else {
          console.error('Cập nhật không thành công, mã lỗi: ', response.status);
        }
      } catch (error) {
      }
    }
  };

  // Hàm thay đổi giá trị các trường của máy bay
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedAirplane((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Hàm xóa máy bay
  const handleDeleteAirplane = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/admin/airplanes/${id}`);
      if (response.status === 200) {
        alert('Xóa máy bay thành công!');
        fetchAirplanes(); // Lấy lại danh sách máy bay sau khi xóa
      } else {
        console.error('Xóa không thành công, mã lỗi: ', response.status);
      }
    } catch (error) {
      console.error('Error deleting airplane:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Quản lý mẫu máy bay</h2>

      {/* Bảng hiển thị danh sách máy bay */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#A6C7E7' }}>Mã máy bay</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#A6C7E7' }}>Hãng sản xuất</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#A6C7E7' }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#A6C7E7' }}>Số ghế</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#A6C7E7' }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#A6C7E7' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {airplanes.map((airplane) => (
              <TableRow key={airplane.id}>
                <TableCell>{airplane.airplane_code}</TableCell>
                <TableCell>{airplane.manufacturer}</TableCell>
                <TableCell>{airplane.model}</TableCell>
                <TableCell>{airplane.seat_count}</TableCell>
                <TableCell>{airplane.description}</TableCell>
                <TableCell>
                  {/* Nút Cập nhật */}
                  <IconButton onClick={() => handleOpenDialog(airplane)}>
                    <EditIcon />
                  </IconButton>
                  {/* Nút Xóa */}
                  <IconButton onClick={() => handleDeleteAirplane(airplane.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal để cập nhật thông tin máy bay */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cập nhật thông tin máy bay</DialogTitle>
        <DialogContent>
          <TextField
            label="Mã máy bay"
            name="airplane_code"
            value={selectedAirplane?.airplane_code || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Hãng sản xuất"
            name="manufacturer"
            value={selectedAirplane?.manufacturer || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Model"
            name="model"
            value={selectedAirplane?.model || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Số ghế"
            name="seat_count"
            type="number"
            value={selectedAirplane?.seat_count || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            name="description"
            value={selectedAirplane?.description || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleUpdateAirplane} color="primary">Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageAirplanes;
