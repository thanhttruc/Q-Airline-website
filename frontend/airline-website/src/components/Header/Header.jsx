import React, { useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Button } from 'reactstrap';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // Import useCart
import './header.css';
import logo from '../../assets/image/logo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FaShoppingCart } from 'react-icons/fa'; // Import biểu tượng giỏ hàng

const Header = () => {
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    const { getCartCount } = useCart(); // Lấy số lượng sản phẩm trong giỏ hàng

    const logout = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/users/logout", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                dispatch({ type: "LOGOUT" });
                navigate("/home");
            } else {
                console.error("Lỗi khi đăng xuất");
            }
        } catch (error) {
            console.error("Lỗi khi kết nối đến server:", error);
        }
    };

    const stickyHeaderFunc = () => {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                headerRef.current.classList.add('sticky__header');
            } else {
                headerRef.current.classList.remove('sticky__header');
            }
        });
    };

    useEffect(() => {
        stickyHeaderFunc();

        return () => window.removeEventListener('scroll', stickyHeaderFunc); // Corrected the cleanup
    }, []);

        // Hàm xử lý khi nhấn vào giỏ hàng
        const handleCartClick = () => {
            navigate('/cart');  // Chuyển hướng đến trang /cart
        };

    const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

    // CSS inline cho giỏ hàng
    const cartIconStyle = {
        position: 'relative',
        cursor: 'pointer',
    };

    const cartCountStyle = {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
    };

    return (
        <header className="header" ref={headerRef}>
            <Container>
                <Row>
                    <div className="nav__wrapper d-flex align-items-center justify-content-between">
                        {/* ========== LOGO ========== */}
                        <div className="nav__logo">
                            <img src={logo} alt="header" />
                        </div>
                        <div className="navigation">
                            <nav>
                                <ul className="nav__links" ref={menuRef}>
                                    <li className="link "><Link to="/home">Trang chủ</Link></li>
                                    <li className="link "><Link to="/about">Giới thiệu</Link></li>
                                    <li className="link "><Link to="/flight">Chuyến bay</Link></li>
                                    <li className="link "><Link to="/promotion">Khuyến mãi</Link></li>
                                    <li className="link"><Link to="/order">Đặt vé</Link></li>
                                </ul>
                            </nav>
                        </div>
                        {/* ========== LOGO END ========== */}
                        <div className="nav__right d-flex align-items-center gap-4">
                            <div className="nav__btns d-flex align-items-center gap-4">
                                {user && user.username ? (
                                    <>
                                        <h5 className="mb-0 user__name">Xin chào, {user.username}</h5>
                                        <Button className="btn btn-dark" onClick={logout}>
                                            Đăng xuất
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className="btn secondary__btn">
                                            <Link to="/login">Đăng nhập</Link>
                                        </Button>
                                        <Button className="btn primary__btn">
                                            <Link to="/register">Đăng ký</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                            {/* Giỏ hàng */}
                            <div className="cart-icon" style={cartIconStyle} onClick={handleCartClick}>
                                <FaShoppingCart size={30} />
                                <span className="cart-count" style={cartCountStyle}>
                                    {getCartCount()}
                                </span> {/* Hiển thị số lượng sản phẩm trong giỏ */}
                            </div>
                            {/* Icon toggle */}
                            <span className="mobile__menu">
                                <FontAwesomeIcon icon={faBars} onClick={toggleMenu} />
                            </span>
                        </div>
                    </div>
                </Row>
            </Container>
        </header>
    );
};

export default Header;
