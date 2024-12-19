import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Spinner } from "reactstrap"; 
import "../../styles/promotion.css"; 

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/promotions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const promotionsArray = Object.values(data);
        setPromotions(promotionsArray);
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

  return (
    <div className="promotion-container">
      <h1 className="promotion-header">Danh sách khuyến mãi</h1>

      {loading && (
        <div className="loading-spinner">
          <Spinner color="primary" />
        </div>
      )}

      {error && <p className="error-text">Lỗi: {error}</p>}

      {promotions.length === 0 ? (
        <p className="no-promotion">Không có khuyến mãi nào hiện tại.</p>
      ) : (
        <Row>
          {promotions.map((promotion) => (
            <Col md="4" sm="6" key={promotion.id} className="promotion-card">
              <Card className="promotion-card-item">
                <img
                  alt="promotion-img"
                  src="https://via.placeholder.com/300" 
                  className="card-img-top"
                />
                <CardBody>
                  <CardTitle tag="h5">{promotion.title}</CardTitle>
                  <CardText>{promotion.description}</CardText>
                  <CardText>
                    <strong>Thời gian:</strong>{" "}
                    {new Date(promotion.start_date).toLocaleString()} -{" "}
                    {new Date(promotion.end_date).toLocaleString()}
                  </CardText>
                  <CardText>
                    <strong>Trạng thái:</strong> {promotion.status}
                  </CardText>
                  <Button color="primary" className="promotion-button">
                    Xem Chi Tiết
                  </Button>
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
