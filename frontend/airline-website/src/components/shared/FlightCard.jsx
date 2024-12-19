import React from 'react'
import { Card, CardBody, CardTitle, CardText } from 'reactstrap'
import { Link } from 'react-router-dom'

const FlightCard = ({ flight }) => {
  return (
    <Card className="flight-card-item">
      <CardBody>
        <CardTitle tag="h5">{flight.flight_code}</CardTitle>
        <CardText>
          <strong>Hãng hàng không:</strong> {flight.airline} <br />
          <strong>Đi từ:</strong> {flight.departure_location_id} <br />
          <strong>Đến:</strong> {flight.arrival_location_id}
        </CardText>
        <CardText>
          <strong>Thời gian cất cánh:</strong> {new Date(flight.departure_time).toLocaleString()} <br />
          <strong>Thời gian hạ cánh:</strong> {new Date(flight.arrival_time).toLocaleString()}
        </CardText>
        <CardText>
          <strong>Trạng thái:</strong> {flight.status}
        </CardText>
        <Link to={`/flights/${flight.flight_code}`} className="btn btn-primary">
          Xem chi tiết
        </Link>
      </CardBody>
    </Card>
  )
}

export default FlightCard
