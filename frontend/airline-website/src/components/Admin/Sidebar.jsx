import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Avatar, Typography, Collapse, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import "./Sidebar.css"

function Sidebar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPage, setOpenPage] = useState("");  // State để lưu trang hiện tại
  const [openDialog, setOpenDialog] = useState(false);  // State để điều khiển modal thêm địa điểm
  const [locationName, setLocationName] = useState(""); // State lưu tên địa điểm
  const [locationDescription, setLocationDescription] = useState(""); // State lưu mô tả địa điểm

  // States cho máy bay
  const [airplaneCode, setAirplaneCode] = useState(""); // Mã máy bay
  const [manufacturer, setManufacturer] = useState(""); // Nhà sản xuất
  const [model, setModel] = useState(""); // Mẫu máy bay
  const [seatCount, setSeatCount] = useState(""); // Số ghế
  const [description, setDescription] = useState(""); // Mô tả máy bay

  // Dialog cho máy bay
  const [openAirplaneDialog, setOpenAirplaneDialog] = useState(false); // Mở/đóng dialog thêm máy bay

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/session');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleToggle = (page) => {
    setOpenPage(openPage === page ? "" : page);  // Toggle trang
  };

  // Hàm mở modal thêm địa điểm
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Hàm đóng modal thêm địa điểm
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Hàm lưu tên địa điểm và mô tả
  const handleSaveLocation = async () => {
    if (!locationName.trim() || !locationDescription.trim()) {
      alert("Vui lòng nhập tên và mô tả địa điểm.");
      return;
    }

    try {
      const response = await fetch('/admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: locationName, description: locationDescription }),
      });

      if (!response.ok) {
        throw new Error('Không thể thêm địa điểm');
      }

      const data = await response.json();
      console.log('Địa điểm đã được thêm:', data);

      // Reset lại tên địa điểm và mô tả, đồng thời đóng modal
      setLocationName("");
      setLocationDescription("");
      setOpenDialog(false);

      alert("Địa điểm đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm địa điểm:", error);
      alert("Đã xảy ra lỗi khi thêm địa điểm.");
    }
  };

  // Hàm mở modal thêm máy bay
  const handleOpenAirplaneDialog = () => {
    setOpenAirplaneDialog(true);
  };

  // Hàm đóng modal thêm máy bay
  const handleCloseAirplaneDialog = () => {
    setOpenAirplaneDialog(false);
  };

  // Hàm lưu mẫu máy bay mới
  const handleSaveAirplane = async () => {
    if (!airplaneCode.trim() || !manufacturer.trim() || !model.trim() || !seatCount.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin máy bay.");
      return;
    }

    try {
      const response = await fetch('/admin/airplanes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          airplane_code: airplaneCode,
          manufacturer: manufacturer,
          model: model,
          seat_count: seatCount,
          description: description
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể thêm mẫu máy bay');
      }

      const data = await response.json();
      console.log('Máy bay đã được thêm:', data);

      // Reset lại các trường và đóng dialog
      setAirplaneCode("");
      setManufacturer("");
      setModel("");
      setSeatCount("");
      setDescription("");
      setOpenAirplaneDialog(false);

      alert("Mẫu máy bay đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mẫu máy bay:", error);
      alert("Đã xảy ra lỗi khi thêm mẫu máy bay.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: 250, height: '100vh', backgroundColor: '#f4f4f4', padding: '20px' }}>
      {/* Phần profile người dùng */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {user && (
          <>
            <Avatar
              alt={user.username}
              src={`https://www.gravatar.com/avatar/${user.id}?d=identicon`}
              sx={{ width: 80, height: 80, margin: 'auto' }}
            />
            <Typography variant="h6" style={{ marginTop: '10px' }}>
              {user.username}
            </Typography>
          </>
        )}
      </div>

      {/* Danh sách menu */}
      <List>
        <ListItem button onClick={() => handleToggle("manageAirports")}>
          <ListItemText primary="Quản lý điểm bay" />
        </ListItem>
        <Collapse in={openPage === "manageAirports"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="manage-airports" className="sidebar-submenu">
              <ListItemText primary="Trang quản lý điểm bay" />
            </ListItem>
            <ListItem button onClick={handleOpenDialog} className="sidebar-submenu">
              <ListItemText primary="Thêm địa điểm" />
            </ListItem>
          </List>
        </Collapse>

        {/* Quản lý máy bay */}
        <ListItem button onClick={() => handleToggle("manageAirplanes")}>
          <ListItemText primary="Quản lý mẫu máy bay" />
        </ListItem>
        <Collapse in={openPage === "manageAirplanes"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="manage-airplanes" className="sidebar-submenu">
              <ListItemText primary="Trang quản lý mẫu máy bay" />
            </ListItem>
            <ListItem button onClick={handleOpenAirplaneDialog} className="sidebar-submenu">
              <ListItemText primary="Thêm mẫu máy bay mới" />
            </ListItem>
          </List>
        </Collapse>

        {/* Các menu khác */}
          {/*Đơn hàng*/}
          <ListItem button component={Link} to="manage-orders" >
          <ListItemText primary="Quản lý đơn hàng" />
        </ListItem>
      </List>

      {/* Quan li khuyen mai */}
      <ListItem button onClick={() => handleToggle("managePromotions")}>
          <ListItemText primary="Quản lý khuyến mãi" />
        </ListItem>
        <Collapse in={openPage === "managePromotions"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="manage-promotions"className="sidebar-submenu">
              <ListItemText primary="Trang quản lý khuyến mãi" />
            </ListItem>
            <ListItem button className="sidebar-submenu">
              <ListItemText primary="Kích hoạt Vouchers" />
            </ListItem>
            <ListItem button className="sidebar-submenu">
              <ListItemText primary="Đăng bài khuyến mại" />
            </ListItem>
          </List>
        </Collapse>

      {/* Modal để thêm địa điểm */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Thêm địa điểm mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên địa điểm"
            fullWidth
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveLocation} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal để thêm mẫu máy bay */}
      <Dialog open={openAirplaneDialog} onClose={handleCloseAirplaneDialog}>
        <DialogTitle>Thêm mẫu máy bay mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mã máy bay"
            fullWidth
            value={airplaneCode}
            onChange={(e) => setAirplaneCode(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Nhà sản xuất"
            fullWidth
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mẫu máy bay"
            fullWidth
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Số ghế"
            fullWidth
            value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAirplaneDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveAirplane} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Sidebar;
