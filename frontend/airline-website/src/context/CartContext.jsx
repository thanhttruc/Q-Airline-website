import React, { createContext, useState, useContext } from 'react';

// Tạo Context để quản lý dữ liệu giỏ hàng
const CartContext = createContext();

// Hook để sử dụng CartContext trong các component khác
export const useCart = () => useContext(CartContext);

// Component Provider để bọc các component con
export const CartProvider = ({ children }) => {
    // State lưu trữ giỏ hàng
    const [cart, setCart] = useState([]);

    // State lưu tổng giá trị của giỏ hàng
    const [totalPrice, setTotalPrice] = useState(0);

    // State lưu mã giảm giá (nếu có)
    const [voucherCode, setVoucherCode] = useState(null);

    // Thêm chuyến bay vào giỏ hàng
    const addToCart = (flight, quantity, ticketPrice) => {
        // Kiểm tra xem chuyến bay đã có trong giỏ hàng chưa
        const existingItem = cart.find(item => item.flight.flight_code === flight.flight_code);
        if (existingItem) {
            // Nếu đã tồn tại, cập nhật số lượng
            setCart(cart.map(item => 
                item.flight.flight_code === flight.flight_code 
                    ? { ...item, quantity: item.quantity + quantity } 
                    : item
            ));
        } else {
            // Nếu chưa tồn tại, thêm chuyến bay mới vào giỏ hàng
            setCart([...cart, {
                flight, 
                quantity, 
                ticketPrice,
                flight_id: flight.id, // ID của chuyến bay
                ticket_type_id: flight.ticket_type_id, // ID loại vé
                price_id: flight.price_id // ID giá vé
            }]);
        }
    };

    // Lấy tổng số lượng các mục trong giỏ hàng
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Lấy tổng giá trị của giỏ hàng
    const getTotalPrice = () => {
        return totalPrice;
    };

    // Cập nhật tổng giá trị của giỏ hàng
    const updateTotalPrice = () => {
        const newTotal = cart.reduce((total, item) => total + item.ticketPrice * item.quantity, 0);
        setTotalPrice(newTotal);
    };

    // Áp dụng mã giảm giá (theo phần trăm)
    const applyVoucher = (voucherDiscount) => {
        const discountAmount = (totalPrice * voucherDiscount) / 100;
        const newTotal = totalPrice - discountAmount;
        setTotalPrice(newTotal);
    };

    // Đặt mã giảm giá và cập nhật tổng giá trị
    const setVoucher = (voucher) => {
        setVoucherCode(voucher); // Lưu mã giảm giá
        const discountAmount = (totalPrice * parseFloat(voucher.discount)) / 100;
        const newTotal = totalPrice - discountAmount;
        setTotalPrice(newTotal);
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCart([]);
        setTotalPrice(0);
        setVoucherCode(null);
    };

    // Sử dụng useEffect để cập nhật tổng giá trị khi giỏ hàng thay đổi
    React.useEffect(() => {
        updateTotalPrice();
    }, [cart]);

    return (
        <CartContext.Provider value={{ 
            cart, // Danh sách các chuyến bay trong giỏ
            addToCart, // Hàm để thêm chuyến bay vào giỏ
            getCartCount, // Hàm để lấy tổng số lượng các mục
            getTotalPrice, // Hàm để lấy tổng giá trị của giỏ
            applyVoucher, // Hàm để áp dụng mã giảm giá
            setVoucher, // Hàm để đặt mã giảm giá
            clearCart, // Hàm để xóa toàn bộ giỏ hàng
            voucherCode // Mã giảm giá hiện tại (nếu có)
        }}>
            {children}
        </CartContext.Provider>
    );
};
