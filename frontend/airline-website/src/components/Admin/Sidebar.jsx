import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { List, ListItem, ListItemText, Avatar, Typography, Collapse, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import "./Sidebar.css";

function Sidebar() {
  const [loading, setLoading] = useState(true);
  const [openPage, setOpenPage] = useState("");  
  const { user, dispatch } = useContext(AuthContext);  
  const navigate = useNavigate();  

  const [userDetails, setUserDetails] = useState(null); 

  // Fetch thông tin người dùng và tự động cập nhật sau mỗi 10 giây
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) {
        setLoading(false); 
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/users/session`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data); 
        } else {
          throw new Error('Không thể lấy thông tin người dùng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    // Gọi API lần đầu tiên khi component load
    fetchUserDetails();

    // Tạo interval để tự động cập nhật thông tin người dùng mỗi 10 giây
    const interval = setInterval(() => {
      fetchUserDetails();
    }, 10000); // 10000ms = 10 giây

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(interval);
  }, [user]); // Chạy lại mỗi khi user thay đổi

  const [openDialog, setOpenDialog] = useState(false);  
  const [locationName, setLocationName] = useState(""); 
  const [locationDescription, setLocationDescription] = useState(""); 

  // States cho máy bay
  const [airplaneCode, setAirplaneCode] = useState(""); 
  const [manufacturer, setManufacturer] = useState(""); 
  const [model, setModel] = useState(""); 
  const [seatCount, setSeatCount] = useState(""); 
  const [description, setDescription] = useState(""); 

  const [openAirplaneDialog, setOpenAirplaneDialog] = useState(false); 

  const handleToggle = (page) => {
    setOpenPage(openPage === page ? "" : page);  
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error('Không thể thêm địa điểm');
      }

      const data = await response.json();
      console.log('Địa điểm đã được thêm:', data);

      setLocationName("");
      setLocationDescription("");
      setOpenDialog(false);

      alert("Địa điểm đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm địa điểm:", error);
      alert("Đã xảy ra lỗi khi thêm địa điểm.");
    }
  };

  const handleOpenAirplaneDialog = () => {
    setOpenAirplaneDialog(true);
  };

  const handleCloseAirplaneDialog = () => {
    setOpenAirplaneDialog(false);
  };

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
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error('Không thể thêm mẫu máy bay');
      }

      const data = await response.json();
      console.log('Máy bay đã được thêm:', data);

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

  const handleLogout = async () => {
    try {
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
      alert("Đăng xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      alert("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
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
        <ListItem button component={Link} to="manage-orders" >
          <ListItemText primary="Quản lý đơn hàng" />
        </ListItem>

        <ListItem button component={Link} to="manage-ticket-prices" >
          <ListItemText primary="Quản lý vé đặt" />
        </ListItem>

        <ListItem button onClick={() => handleToggle("managePromotions")}>
          <ListItemText primary="Quản lý khuyến mãi" />
        </ListItem>
        <Collapse in={openPage === "managePromotions"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="manage-promotions" className="sidebar-submenu">
              <ListItemText primary="Trang quản lý khuyến mãi" />
            </ListItem>
            <ListItem button component={Link} to="manage-vouchers" className="sidebar-submenu">
              <ListItemText primary="Kích hoạt Vouchers" />
            </ListItem>
            <ListItem button component={Link} to="manage-create-promotions" className="sidebar-submenu">
              <ListItemText primary="Đăng bài khuyến mại" />
            </ListItem>
          </List>
        </Collapse>

        {/* Đăng xuất */}
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Đăng xuất" />
        </ListItem>
      </List>

      {/* Dialog thêm địa điểm */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Thêm địa điểm mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên địa điểm"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveLocation} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm máy bay */}
      <Dialog open={openAirplaneDialog} onClose={handleCloseAirplaneDialog}>
        <DialogTitle>Thêm mẫu máy bay mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Mã máy bay"
            value={airplaneCode}
            onChange={(e) => setAirplaneCode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nhà sản xuất"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mẫu máy bay"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Số ghế"
            value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAirplaneDialog} color="primary">
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
