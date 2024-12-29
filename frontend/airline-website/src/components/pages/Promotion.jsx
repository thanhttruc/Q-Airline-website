import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Spinner } from "reactstrap";
import "../../styles/promotion.css";
import p1 from "../../assets/image/promotion1.png";
import p2 from "../../assets/image/promotion2.png";
import p3 from "../../assets/image/promotion3.png";
import p4 from "../../assets/image/promotion4.png";
import p5 from "../../assets/image/promotion5.png";
import p6 from "../../assets/image/promotion6.png";

const Promotion = () => {
  const images = [p1, p2, p3, p4, p5, p6];

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/promotions');
      if (response.ok) {
        const data = await response.json();
        setPromotions(Array.isArray(data) ? data : Object.values(data));
      } else {
        throw new Error('Lỗi khi lấy danh sách khuyến mãi.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const getRandomImage = () => images[Math.floor(Math.random() * images.length)];

  return (
    <div className="promotion-container">
      <div className="promotion-header-wrapper">
        <h1 className="promotion-header">Danh sách khuyến mãi</h1>
        <div className="header-underline"></div>
      </div>

      {loading && (
        <div className="loading-spinner">
          <Spinner color="primary" />
        </div>
      )}

      {error && <p className="error-text">Lỗi: {error}</p>}

      {!loading && !error && promotions.length === 0 && (
        <p className="no-promotion">Hiện không có khuyến mãi nào.</p>
      )}

      {!loading && !error && promotions.length > 0 && (
        <Row className="promotion-row">
          {promotions.map((promotion) => (
            <Col md="4" sm="6" key={promotion.id} className="promotion-card">
              <Card className="promotion-card-item">
                <div className="card-image-container">
                  <img
                    alt="promotion-img"
                    src={getRandomImage()}
                    className="card-img-top"
                  />
                </div>
                <CardBody className="card-body-content">
                  <CardTitle className="promotion-card-title">
                    {promotion.title}
                  </CardTitle>
                  <CardText className="promotion-card-description">
                    {promotion.description}
                  </CardText>
                  <CardText className="promotion-card-time">
                    <strong>Thời gian:</strong>{" "}
                    {new Date(promotion.start_date).toLocaleString()} -{" "}
                    {new Date(promotion.end_date).toLocaleString()}
                  </CardText>
                  <CardText className="promotion-card-status">
                    <strong>Trạng thái:</strong> {promotion.status}
                  </CardText>
                  {/* <Button className="promotion-button">Xem Chi Tiết</Button> */}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Promotion;
