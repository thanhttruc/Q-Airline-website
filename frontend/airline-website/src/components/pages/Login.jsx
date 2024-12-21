import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { AuthContext } from "../../context/AuthContext";
import loginImg from '../../assets/image/login.png'
import userIcon from '../../assets/image/user.png'
import "../../styles/login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null); 
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng nhập đến API backend
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Gửi session cookie nếu có
      });

      if (res.ok) {
        const user = await res.json();
        
        // Kiểm tra nếu có dữ liệu người dùng trong phản hồi
        if (user && user.user) {
          // Cập nhật AuthContext với thông tin người dùng
          dispatch({ type: "LOGIN_SUCCESS", payload: user.user });
      console.log('Thông tin người dùng:', user.user);
          // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
          navigate("/home");
        } else {
          setError("Đăng nhập thất bại, vui lòng thử lại.");
          dispatch({ type: "LOGIN_FAILURE", payload: "Đăng nhập thất bại" });
        }
      } else {
        const errorMessage = await res.json();
        setError(errorMessage.message || "Đăng nhập không thành công.");
        dispatch({ type: "LOGIN_FAILURE", payload: errorMessage.message || "Đăng nhập không thành công" });
      }
    } catch (err) {
      setError("Lỗi kết nối: " + err.message);
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
    }
  };

  return (
    <section>
      <Container>
        <Row>
        <Col lg='8' className='m-auto'>
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Đăng nhập</h2>

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder='Tên đăng nhập'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder='Mật khẩu'
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <Button className='btn secondary__btn auth__btn' type='submit'>
                    Đăng nhập
                  </Button>
                </Form>
                {error && <p className="error-text">{error}</p>} 
                <p>Chưa có tài khoản? <Link to='/register'>Tạo tài khoản mới</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
