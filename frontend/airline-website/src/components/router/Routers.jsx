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
import FlightDetails from '../pages/FlightDetails';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />

      <Route path="/home" element={<Home />} />
      <Route path="/flight" element={<Flight />} />
      <Route path="/promotion" element={<Promotion />} />
      <Route path="/login" element={<Login />} />
      <Route path="/order" element={<Order />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path='/flights/:flight_code' element={<FlightDetails />} />
    </Routes>
  );
};

export default Routers;
