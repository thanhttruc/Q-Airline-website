import React from 'react'
import { useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import Routers from '../router/Routers'
import Sidebar from '../Admin/Sidebar'

const Layout = () => {
   const location = useLocation();
 
   // Kiểm tra nếu trang hiện tại là trang admin
   const isAdminPage = location.pathname.startsWith('/admin');
 
   return (
     <>
       {/* Chỉ hiển thị Header và Footer nếu không phải trang admin */}
       {!isAdminPage && <Header />}
       <Routers />
       {!isAdminPage && <Footer />}
     </>
   );
 };

export default Layout