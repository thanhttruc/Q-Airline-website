// src/components/Dashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; 
import "./Dashboard.css" // Để hiển thị nội dung của các route con

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <Outlet /> {/* Nội dung của các trang con sẽ được hiển thị ở đây */}
      </div>
    </div>
  );
};

export default Dashboard;
