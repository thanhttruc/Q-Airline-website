import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';

function ManageTicketPrices() {
  const [prices, setPrices] = useState([]);
  const [newPrice, setNewPrice] = useState({
    flight_id: '',
    ticket_type_id: '',
    price: '',
  });
  const [editingPrice, setEditingPrice] = useState(null);
  const [flights, setFlights] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all ticket prices, flights, and ticket types on component mount
  useEffect(() => {
    fetchPrices();
    fetchFlights();
    fetchTicketTypes();
  }, []);

  // Fetch all ticket prices from the backend
  const fetchPrices = async () => {
    try {
      const response = await axios.get('/api/prices');
      console.log('Prices response:', response.data);
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPrices([]);
    }
  };

  // Fetch all flights from the backend
  const fetchFlights = async () => {
    try {
      const response = await axios.get('/api/flights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  // Fetch all ticket types from the backend
  const fetchTicketTypes = async () => {
    try {
      const response = await axios.get('/api/ticket-types');
      setTicketTypes(response.data);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the creation of a new price
  const handleCreatePrice = async () => {
    try {
      const response = await axios.post('/api/prices', newPrice);
      setPrices([...prices, response.data]);
      setNewPrice({ flight_id: '', ticket_type_id: '', price: '' });
    } catch (error) {
      console.error('Error creating price:', error);
    }
  };

  // Handle editing a price
  const handleEditPrice = (price) => {
    setEditingPrice({ ...price });
  };

  const handleUpdatePrice = async () => {
    try {
      const response = await axios.put(`/api/prices/${editingPrice.id}`, editingPrice);
      setPrices(prices.map((price) => (price.id === editingPrice.id ? response.data : price)));
      setEditingPrice(null);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  // Handle deleting a price
  const handleDeletePrice = async (id) => {
    try {
      await axios.delete(`/api/prices/${id}`);
      setPrices(prices.filter((price) => price.id !== id));
    } catch (error) {
      console.error('Error deleting price:', error);
    }
  };

  return (
    <div>
      <h2>Quản lý vé đặt</h2>

      {/* Create New Price */}
      <div>
        <h3>Thêm giá vé mới</h3>
        
        {/* Flight ID Selection */}
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Chọn Flight ID</InputLabel>
          <Select
            value={newPrice.flight_id}
            onChange={(e) => setNewPrice({ ...newPrice, flight_id: e.target.value })}
            label="Chọn Flight ID"
          >
            {flights.map((flight) => (
              <MenuItem key={flight.id} value={flight.id}>
                {flight.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Ticket Type ID Selection */}
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Chọn Ticket Type ID</InputLabel>
          <Select
            value={newPrice.ticket_type_id}
            onChange={(e) => setNewPrice({ ...newPrice, ticket_type_id: e.target.value })}
            label="Chọn Ticket Type ID"
          >
            {ticketTypes.map((ticketType) => (
              <MenuItem key={ticketType.id} value={ticketType.id}>
                {ticketType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price Input */}
        <TextField
          label="Price"
          type="number"
          value={newPrice.price}
          onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
          fullWidth
          margin="normal"
        />

        {/* Submit Button */}
        <Button onClick={handleCreatePrice} variant="contained" color="primary">
          Thêm giá vé
        </Button>
      </div>

      {/* List of Prices */}
      <div>
        <h3>Danh sách giá vé</h3>
        {loading ? (
          <CircularProgress />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Flight ID</th>
                <th>Ticket Type ID</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {prices.length > 0 ? (
                prices.map((price) => (
                  <tr key={price.id}>
                    <td>{price.id}</td>
                    <td>{price.flight_id}</td>
                    <td>{price.ticket_type_id}</td>
                    <td>{price.price}</td>
                    <td>
                      <Button onClick={() => handleEditPrice(price)} variant="outlined" color="primary">Chỉnh sửa</Button>
                      <Button onClick={() => handleDeletePrice(price.id)} variant="outlined" color="secondary">Xóa</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">Không có giá vé nào</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Price Modal */}
      {editingPrice && (
        <div>
          <h3>Chỉnh sửa giá vé</h3>
          
          {/* Flight ID Selection */}
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Chọn Flight ID</InputLabel>
            <Select
              value={editingPrice.flight_id}
              onChange={(e) => setEditingPrice({ ...editingPrice, flight_id: e.target.value })}
              label="Chọn Flight ID"
            >
              {flights.map((flight) => (
                <MenuItem key={flight.id} value={flight.id}>
                  {flight.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Ticket Type ID Selection */}
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Chọn Ticket Type ID</InputLabel>
            <Select
              value={editingPrice.ticket_type_id}
              onChange={(e) => setEditingPrice({ ...editingPrice, ticket_type_id: e.target.value })}
              label="Chọn Ticket Type ID"
            >
              {ticketTypes.map((ticketType) => (
                <MenuItem key={ticketType.id} value={ticketType.id}>
                  {ticketType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Price Input */}
          <TextField
            label="Price"
            type="number"
            value={editingPrice.price}
            onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
            fullWidth
            margin="normal"
          />

          {/* Update and Cancel Buttons */}
          <Button onClick={handleUpdatePrice} variant="contained" color="primary">
            Cập nhật
          </Button>
          <Button onClick={() => setEditingPrice(null)} variant="outlined" color="secondary">
            Hủy
          </Button>
        </div>
      )}
    </div>
  );
}

export default ManageTicketPrices;
