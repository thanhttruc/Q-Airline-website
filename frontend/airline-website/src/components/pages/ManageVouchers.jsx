import React, { useState, useEffect } from 'react';
import { Button, Switch, TextField, FormControlLabel, Container, Grid, Typography, Box, CircularProgress } from '@mui/material';

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    discount: '',
    expiration_date: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch vouchers data from the API
    fetchVouchers();
  }, []);

  // Fetch vouchers using fetch API
  const fetchVouchers = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/vouchers');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      
      // Convert the response from an object to an array if needed
      const voucherArray = Array.isArray(data) ? data : Object.values(data); // Ensure it's an array

      // Convert expiration_date to Date object for easier comparison
      const updatedVouchers = voucherArray.map((voucher) => ({
        ...voucher,
        expiration_date: new Date(voucher.expiration_date), // Convert to Date object
        status: new Date(voucher.expiration_date) < new Date() ? 'Expired' : voucher.status, // Check if expired
      }));
      
      setVouchers(updatedVouchers);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new voucher using fetch
  const handleAddVoucher = async () => {
    // Check if all fields are filled
    if (!newVoucher.code || !newVoucher.discount || !newVoucher.expiration_date) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Send POST request to server to add voucher
      const response = await fetch('http://localhost:3000/admin/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVoucher), // Send new voucher data
      });

      if (!response.ok) {
        throw new Error('Failed to add voucher');
      }

      const data = await response.json(); // Get the newly created voucher
      setVouchers((prevVouchers) => [...prevVouchers, data]); // Add the new voucher to the list
      setNewVoucher({ code: '', discount: '', expiration_date: '' }); // Clear the form

    } catch (error) {
      console.error('Error adding voucher:', error);
      alert('Error adding voucher: ' + error.message);
    }
  };

  const handleDeleteVoucher = async (id) => {
    // Kiểm tra nếu ID voucher không tồn tại (Trường hợp có thể xảy ra khi id bị thiếu)
    if (!id) {
      console.error('Voucher ID is missing');
      alert('Voucher ID is missing or invalid!');
      return;
    }
  
    try {
      // Gửi yêu cầu xóa voucher từ backend
      const response = await fetch(`http://localhost:3000/admin/vouchers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
        // Nếu phản hồi là 404 (Voucher không tìm thấy)
        if (response.status === 404) {
          alert('Voucher not found!');
          return;
        }
  
        // Nếu có lỗi khác từ server
        throw new Error('Failed to delete voucher');
      }
  
      // Cập nhật lại danh sách vouchers sau khi xóa
      setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.id !== id));
      alert('Voucher deleted successfully'); // Hiển thị thông báo thành công
  
    } catch (error) {
      console.error('Error deleting voucher:', error);
      alert('Error deleting voucher: ' + error.message);
    }
  };
  
  
  // Toggle voucher status using fetch
  const toggleVoucherStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Expired' : 'Active';

    try {
      // Send PUT request to update voucher status
      const response = await fetch(`http://localhost:3000/admin/vouchers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update voucher status');
      }

      // Update the status of the voucher in the list
      setVouchers(vouchers.map(voucher =>
        voucher.id === id ? { ...voucher, status: newStatus } : voucher
      ));
      
    } catch (error) {
      console.error('Error updating voucher status:', error);
      alert('Error updating voucher status: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Vouchers</Typography>

      {/* Add Voucher Form */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Voucher Code"
            value={newVoucher.code}
            onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Discount (%)"
            type="number"
            value={newVoucher.discount}
            onChange={(e) => setNewVoucher({ ...newVoucher, discount: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Expiration Date"
            type="datetime-local"
            value={newVoucher.expiration_date}
            onChange={(e) => setNewVoucher({ ...newVoucher, expiration_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddVoucher}
        sx={{ marginTop: 2 }}
      >
        Add Voucher
      </Button>

      {/* Display List of Vouchers */}
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        {vouchers.length === 0 ? (
          <Typography>No vouchers available.</Typography>
        ) : (
          vouchers.map((voucher) => (
            <Grid item xs={12} sm={6} md={4} key={voucher.id}>
              <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6">{voucher.code} - {voucher.discount}% off</Typography>
                <Typography variant="body2">Expires on: {new Date(voucher.expiration_date).toLocaleString()}</Typography>
                <Typography variant="body2" color={voucher.status === 'Expired' ? 'error' : 'textPrimary'}>
                  Status: {voucher.status}
                </Typography>

                {/* Toggle Status Switch */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={voucher.status === 'Active'}
                      disabled={voucher.status === 'Expired'}
                      onChange={() => toggleVoucherStatus(voucher.id, voucher.status)}
                      color={voucher.status === 'Expired' ? 'error' : 'primary'}
                    />
                  }
                  label="Active"
                />

                {/* Delete Button */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteVoucher(voucher.id)}
                  sx={{ marginTop: 2 }}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Vouchers;
