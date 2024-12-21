import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthContextProvider } from '../../context/AuthContext';

import Home from '../pages/Home';
import Flight from '../pages/Flight';
import Promotion from '../pages/Promotion';
import Order from '../pages/Order';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Booking from '../pages/Booking';
import FlightDetails from '../pages/FlightDetails';
import Dashboard from '../Admin/Dashboard'
import ManageAirports from '../pages/ManageAirports';
import ManageOrders from '../pages/ManageOrders';
import ManageAirplanes from '../pages/ManageAirplanes';
import ManagePromotions from '../pages/ManagePromotions';
import ManageCreatePromotions from '../pages/ManageCreatePromotions';
import ManageVouchers from '../pages/ManageVouchers';
import ManageTicketPrices from '../pages/ManageTicketPrices';

const Routers = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<Dashboard />}>
          {/* Các route con sẽ là các đường dẫn tương đối */}
          <Route path="manage-airports" element={<ManageAirports />} />
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route path="manage-airplanes" element={<ManageAirplanes />} />
          <Route path="manage-promotions" element={<ManagePromotions />} />
          <Route path="manage-create-promotions" element={<ManageCreatePromotions />} />
          <Route path="manage-vouchers" element={<ManageVouchers />} />
          <Route path="manage-ticket-prices" element={<ManageTicketPrices />} />

      </Route>
      

      <Route path="/" element={<Navigate to="/home" />} />

      <Route path="/home" element={<Home />} />
      <Route path="/flight" element={<Flight />} />
      <Route path="/promotion" element={<Promotion />} />
      <Route path="/login" element={<Login />} />
      <Route path="/order" element={<Order />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path='/flights/:flight_code' element={<FlightDetails />} />
      <Route path='/booking' element={<Booking />} />
    </Routes>
  );
};

export default Routers;
