import React, { useContext, useState } from 'react'

import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import "../../styles/login.css"
import { Link, useNavigate } from 'react-router-dom'
import registerImg from '../../assets/image/login.png'
import userIcon from '../../assets/image/user.png'
import { AuthContext } from "../../context/AuthContext";
// import { BASE_URL } from '../ultis/config'

const Register = () => {
  const [credentials, setCredentials] = useState({
    userName: undefined,
    password: undefined,
    email: undefined,
    full_name: undefined,
  })

  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleClick = async e => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      const result = await res.json()

      if (!res.ok) alert(result.message)

      dispatch({ type: 'REGISTER_SUCCESS' })
      navigate('/login')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' className='m-auto'>
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Đăng kí</h2>

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input type="text" placeholder='Tên đăng nhập' id='username' onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <input type="password" placeholder='Mật khẩu' id='password' onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <input type="email" placeholder='Email' id='email' onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <input type="text" placeholder='Họ và tên' id='full_name' onChange={handleChange} required />
                  </FormGroup>
                  <Button className='btn secondary__btn auth__btn' type='submit'>Tạo tài khoản</Button>
                </Form>
                <p>Đã có tài khoản? <Link to='/login'>Đăng nhập</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Register