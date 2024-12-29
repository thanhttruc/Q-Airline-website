import React, { useState, useEffect } from 'react';
import {useContext } from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Label } from 'recharts';
import styled from 'styled-components';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';


const DashboardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
`;

const ChartContainer = styled.div`
  width: 60%;
  height: 600px;
`;

const TableContainer = styled.div`
  width: 35%;
  overflow-x: auto;
`;

const ManageAirports = () => {

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [locations, setLocations] = useState([]);
  const { user } = useContext(AuthContext);
  

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isFetchingData, setIsFetchingData] = useState(false); // New loading state for data fetching

  useEffect(() => {
    if (!user) {
      alert('Bạn cần đăng nhập để thanh toán!');
      return;
    }
    const fetchData = async () => {
      try {
        setIsFetchingData(true);

        // Fetch user details
        const userResponse = await fetch('http://localhost:3000/api/users/session', {
          method: 'GET',
          credentials: 'include',
        });
        const userData = await userResponse.json();
        setUserDetails(userData);

        // Fetch chart data
        const chartResponse = await fetch('/api/lcount');
        const chartJson = await chartResponse.json();
        const formattedChartData = Object.values(chartJson.data).map(item => ({
          location_name: item.location_name,
          order_count: item.order_count,
        }));
        setChartData(formattedChartData);

        // Fetch location data
        const locationResponse = await fetch('/api/locations');
        const locationJson = await locationResponse.json();
        const formattedLocationData = Object.values(locationJson).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }));
        setLocations(formattedLocationData);

      } catch (error) {
        setError("Lỗi khi tải dữ liệu");
        console.error("Error fetching data:", error);
      } finally {
        setIsFetchingData(false);  // Stop loading
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa địa điểm này?')) {
      try {
        const response = await axios.delete(`/admin/locations/${id}`);
        alert(response.data.message);
        setLocations(prevLocations => prevLocations.filter(location => location.id !== id)); // Remove the deleted location
      } catch (error) {
        alert('Lỗi khi xóa địa điểm');
      }
    }
  };

  const handleUpdate = (location) => {
    setSelectedLocation(location);
    setName(location.name);
    setDescription(location.description);
    setOpenDialog(true); // Open the update modal
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
      setLocations(prevLocations => prevLocations.map(location => 
        location.id === selectedLocation.id 
        ? { ...location, name, description }
        : location
      ));
      handleCloseDialog(); // Close the dialog after successful update
    } catch (error) {
      alert('Lỗi khi cập nhật địa điểm');
    }
  };

  if (isFetchingData) {
    return <div style={{ textAlign: 'center' }}><CircularProgress /></div>; // Show loading spinner
  }

  return (
    <div>
      <h2>Quản lý sân bay</h2>
      <p>Trang quản lý sân bay sẽ được hiển thị ở đây.</p>

      <DashboardContainer>
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
                    <button
                      onClick={() => handleUpdate(location)}
                      style={{ marginRight: '10px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      style={{ background: 'transparent', color: 'red', border: 'none', cursor: 'pointer' }}
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
          <Button onClick={handleCloseDialog} color="primary">Hủy</Button>
          <Button onClick={handleSaveUpdate} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAirports;
