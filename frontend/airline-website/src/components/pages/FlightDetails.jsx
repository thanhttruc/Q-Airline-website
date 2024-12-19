import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/flightdetails.css'; // Đảm bảo đường dẫn đúng
import travel1 from '../../assets/image/4.jpg';
import travel2 from '../../assets/image/2.jpg';
import travel3 from '../../assets/image/3.jpg';
import travel4 from '../../assets/image/1.jpg';


const FlightDetails = () => {
  const { flight_code } = useParams();
  const [flight, setFlight] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/flights/${flight_code}`)
      .then((response) => response.json())
      .then((data) => {
        setFlight(data);
      })
      .catch((err) => console.error('Error fetching flight details:', err));
  }, [flight_code]);

    const getImage = (locationId) => {
        switch (locationId) {
            case 1: return travel1;
            case 2: return travel2;
            case 3: return travel3;
            case 4: return travel4;
            default: return travel1
        }
    }


  if (!flight) {
    return <p>Loading...</p>;
  }

  return (
      <div className="flight-details-container">
          <div className="flight-header">
              <h1 className="flight-title">Chi tiết chuyến bay: {flight.flight_code}</h1>
              <img
                  src={getImage(flight.departure_location_id)}
                   alt={flight.departure.location}
                  className="flight-header-image"
               />
          </div>


        <div className="flight-info-section">
            <div className="flight-info-left">
              <div className="flight-info-item">
                  <span className="info-label">Mã chuyến bay:</span>
                  <span className="info-value">{flight.flight_code}</span>
              </div>
                <div className="flight-info-item">
                <span className="info-label">Hãng hàng không:</span>
                <span className="info-value">{flight.airline}</span>
            </div>
              <div className="flight-info-item">
                <span className="info-label">Trạng thái:</span>
                <span className="info-value">{flight.status}</span>
                </div>

            <div className="flight-info-item">
                  <span className="info-label">Số ghế:</span>
                  <span className="info-value">{flight.airplane.seat_count}</span>
            </div>
           </div>
            <div className="flight-info-right">
                <div className="flight-info-item">
                    <span className="info-label">Khởi hành:</span>
                    <span className="info-value">
                      {flight.departure.location}
                    </span>
                  <span className="info-time"> {new Date(flight.departure.time).toLocaleString()}</span>
                </div>
                <div className="flight-info-item">
                    <span className="info-label">Đến:</span>
                     <span className="info-value">
                         {flight.arrival.location}
                   </span>
                   <span className="info-time"> {new Date(flight.arrival.time).toLocaleString()}</span>
                </div>
            </div>
         </div>
        <div className="ticket-info-section">
              <h2 className="ticket-heading">Thông tin vé</h2>
            <ul className="ticket-list">
                  {flight.tickets.map((ticket, index) => (
                  <li key={index} className="ticket-item">
                      <span className="ticket-type"><span className="bold-text">Loại vé:</span>{ticket.type}</span>
                      <span className="ticket-price"><span className="bold-text">Giá:</span>${ticket.price}</span>
                  </li>
                   ))}
              </ul>
          </div>
    </div>
  );
};

export default FlightDetails;