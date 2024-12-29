import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar } from '@mui/material';

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false); // Để mở/đóng dialog
  const [selectedFlight, setSelectedFlight] = useState(null); // Để lưu thông tin chuyến bay đang chọn
  const [newDepartureTime, setNewDepartureTime] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get('/api/flights'); // Lấy danh sách chuyến bay
        setFlights(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleDelay = async () => {
    if (selectedFlight && newDepartureTime) {
      try {
        // Gọi API PUT để cập nhật thời gian khởi hành và trạng thái chuyến bay thành "Delayed"
        const response = await axios.put(`http://localhost:3000/api/flights/${selectedFlight.flight_code}`, {
          newDepartureTime,  // Thời gian khởi hành mới
        });

        // Cập nhật lại danh sách chuyến bay sau khi cập nhật thành công
        const updatedFlights = flights.map(flight =>
          flight.flight_code === selectedFlight.flight_code
            ? { ...flight, status: 'Delayed', departure: { ...flight.departure, time: newDepartureTime } }
            : flight
        );
        setFlights(updatedFlights);  // Cập nhật trạng thái và thời gian chuyến bay
        setSnackbarMessage('Flight updated successfully');
        setOpenSnackbar(true);
        setOpenDialog(false); // Đóng dialog sau khi thành công
      } catch (err) {
        console.error('Error updating flight status:', err);
        setSnackbarMessage('Failed to update flight');
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage('Please select a valid time');
      setOpenSnackbar(true);
    }
  };

  if (loading) return <p>Loading flights...</p>;
  if (error) return <p>Error fetching flights: {error.message}</p>;

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thTdStyle = {
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #ddd',
  };

  return (
    <div>
      <h1>Flight Schedule</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Flight Code</th>
            <th style={thTdStyle}>Departure Location</th>
            <th style={thTdStyle}>Arrival Location</th>
            <th style={thTdStyle}>Departure Time</th>
            <th style={thTdStyle}>Arrival Time</th>
            <th style={thTdStyle}>Airline</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Delay</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight.flight_code}>
              <td style={thTdStyle}>{flight.flight_code}</td>
              <td style={thTdStyle}>{flight.departure.location}</td>
              <td style={thTdStyle}>{flight.arrival.location}</td>
              <td style={thTdStyle}>{new Date(flight.departure.time).toLocaleString()}</td>
              <td style={thTdStyle}>{new Date(flight.arrival.time).toLocaleString()}</td>
              <td style={thTdStyle}>{flight.airline}</td>
              <td style={thTdStyle}>
                <span style={{ color: flight.status === 'Scheduled' ? 'green' : 'red' }}>
                  {flight.status}
                </span>
              </td>
              <td style={thTdStyle}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedFlight(flight); // Chọn chuyến bay
                    setOpenDialog(true); // Mở dialog
                  }}
                >
                  Delay
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog chọn thời gian delay */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Flight Departure Time</DialogTitle>
        <DialogContent>
          <TextField
            label="New Departure Time"
            type="datetime-local"
            fullWidth
            value={newDepartureTime}
            onChange={(e) => setNewDepartureTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelay} color="primary" disabled={!newDepartureTime}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default FlightList;
