import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Label } from 'recharts';
import styled from 'styled-components';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import axios from 'axios';

// Styled component cho container biểu đồ và bảng
const DashboardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Khoảng cách giữa biểu đồ và bảng */
  padding: 20px;
`;

const ChartContainer = styled.div`
  width: 60%; /* Chiều rộng của biểu đồ */
  height: 600px;
`;

const TableContainer = styled.div`
  width: 35%; /* Chiều rộng của bảng */
  overflow-x: auto; /* Đảm bảo bảng có thể cuộn ngang nếu quá rộng */
`;

const ManageAirports = () => {
  const [chartData, setChartData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thông tin modal
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Fetch dữ liệu biểu đồ từ API lcount
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/lcount');
        const json = await response.json();

        const formattedData = Object.values(json.data).map(item => ({
          location_name: item.location_name,
          order_count: item.order_count,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    // Fetch dữ liệu danh sách địa điểm từ API location
    const fetchLocationData = async () => {
      try {
        const response = await fetch('/api/locations');
        const json = await response.json();

        const formattedLocationData = Object.values(json).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }));

        setLocations(formattedLocationData);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchChartData();
    fetchLocationData();
    setLoading(false);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa địa điểm này?')) {
      try {
        const response = await axios.delete(`/admin/locations/${id}`);
        alert(response.data.message);
        setLocations(locations.filter(location => location.id !== id)); // Cập nhật lại danh sách địa điểm
      } catch (error) {
        alert('Lỗi khi xóa địa điểm');
      }
    }
  };

  const handleUpdate = (location) => {
    setSelectedLocation(location);
    setName(location.name);
    setDescription(location.description);
    setOpenDialog(true); // Mở modal chỉnh sửa
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setName('');
    setDescription('');
  };

  const handleSaveUpdate = async () => {
    if (!name || !description) {
      alert('Tên và mô tả là bắt buộc!');
      return;
    }

    try {
      const response = await axios.put(`/admin/locations/${selectedLocation.id}`, { name, description });
      alert(response.data.message);
      setLocations(locations.map(location => 
        location.id === selectedLocation.id 
        ? { ...location, name, description }
        : location
      ));
      handleCloseDialog(); // Đóng modal sau khi cập nhật
    } catch (error) {
      alert('Lỗi khi cập nhật địa điểm');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Quản lý sân bay</h2>
      <p>Trang quản lý sân bay sẽ được hiển thị ở đây.</p>

      <DashboardContainer>
        {/* Biểu đồ cột */}
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="order_count" fill="#8884d8" name="Số lượng người đi">
                {chartData.map((entry, index) => (
                  <Label
                    key={`label-${index}`}
                    value={entry.order_count}
                    position="top"
                    style={{ fontSize: '14px', fontWeight: 'bold', fill: '#333' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Bảng danh sách địa điểm */}
        <TableContainer>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên địa điểm</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id}>
                  <td>{location.id}</td>
                  <td>{location.name}</td>
                  <td>{location.description}</td>
                  <td>
                    {/* Biểu tượng Cập nhật */}
                    <button
                      onClick={() => handleUpdate(location)}
                      style={{
                        marginRight: '10px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <EditIcon />
                    </button>
                    {/* Biểu tượng Xóa */}
                    <button
                      onClick={() => handleDelete(location.id)}
                      style={{
                        background: 'transparent',
                        color: 'red',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </DashboardContainer>

      {/* Dialog chỉnh sửa địa điểm */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cập nhật địa điểm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên địa điểm"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Mô tả"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveUpdate} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAirports;
