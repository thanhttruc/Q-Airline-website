import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import "./Dashboard.css";

const Dashboard = () => {
  const { user, dispatch, loading: authLoading } = useContext(AuthContext);  // Sử dụng useContext trực tiếp với AuthContext
  const [loading, setLoading] = useState(true); // Trạng thái loading cho việc lấy thông tin session
  const [userDetails, setUserDetails] = useState(null); // Lưu trữ thông tin session
  const navigate = useNavigate();  // Để điều hướng nếu cần

  // Fetch thông tin session khi component mount
  useEffect(() => {
    if (user) {
      // Nếu đã đăng nhập, không cần gọi API
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/session', {
          method: 'GET',
          credentials: 'include', // Gửi cookie session nếu có
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data); // Lưu thông tin người dùng từ session
          dispatch({ type: 'LOGIN_SUCCESS', payload: data }); // Dispatch thông tin người dùng vào AuthContext
        } else {

          const defaultUser = { username: 'admin00', password: 'admin00' };
          dispatch({ type: 'LOGIN_SUCCESS', payload: defaultUser });
          console.log('Đăng nhập tự động với tài khoản admin00');
        }
      } catch (error) {
        console.error('Lỗi khi fetch session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [user, dispatch]); // Chạy lại khi user hoặc dispatch thay đổi

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Truyền thông tin session xuống Sidebar */}
      <Sidebar userDetails={userDetails} />
      <div className="content">
        <Outlet /> {/* Nội dung của các trang con sẽ được hiển thị ở đây */}
      </div>
    </div>
  );
};

export default Dashboard;
