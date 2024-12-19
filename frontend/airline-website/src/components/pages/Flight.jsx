import React, { useState, useEffect } from 'react';
import { Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';  // Import Link từ react-router-dom
import "../../styles/flight.css";
import travel1 from '../../assets/image/4.jpg'
import travel2 from '../../assets/image/2.jpg'
import travel3 from '../../assets/image/3.jpg'
import travel4 from '../../assets/image/1.jpg'

const Flight = () => {
  const images = [travel1, travel2, travel3, travel4];


  const [searchValue, setSearchValue] = useState('');
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  useEffect(() => {
    fetch('/api/flights')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setFlights(data);
          setFilteredFlights(data);
        } else {
          console.error('Unexpected API response:', data);
          setFlights([]);
          setFilteredFlights([]);
        }
      })
      .catch((err) => console.error('Error fetching flights:', err));
  }, []);

  const handleSearch = () => {
    const results = flights.filter((flight) =>
      flight.departure.location.toLowerCase().includes(searchValue.toLowerCase()) ||
      flight.arrival.location.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredFlights(results);
  };

  return (
    <div className="flight-list-container">
      <div className="search-bar">
        <Input
          type="text"
          placeholder="Tìm chuyến bay theo địa điểm đi hoặc đến..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button color="primary" className="ml-2 search-button" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
      <div className="flight-results">
        {filteredFlights && filteredFlights.length > 0 ? (
          filteredFlights.map((flight, index) => {
            const randomIndex = Math.floor(Math.random() * images.length); // Lấy chỉ số ngẫu nhiên
            return (
              <div key={index} className="flight-card">
                <div className="flight-card-header">
                  <h4 className="flight-code">{flight.flight_code}</h4>
                  <span className="airline">{flight.airline}</span>
                </div>
                <div className="flight-info">
                  <div className="departure-info">
                    <img
                      src={images[randomIndex]} // Sử dụng ảnh ngẫu nhiên
                      alt={flight.departure.location}
                      className="departure-image"
                    />
                    <p><span className="bold-text">Khởi hành: </span>{flight.departure.location}</p>
                    <p className="time-text">{new Date(flight.departure.time).toLocaleString()}</p>
                  </div>
                  <div className="arrival-info">
                    <p><span className="bold-text">Đến: </span>{flight.arrival.location}</p>
                    <p className="time-text">{new Date(flight.arrival.time).toLocaleString()}</p>
                  </div>
                </div>
  
                <div className="flight-details">
                  <div className="ticket-info">
                    <p><span className="bold-text">Loại vé: </span>{flight.tickets.type}</p>
                    <p><span className="bold-text">Giá: </span>${flight.tickets.price}</p>
                  </div>
                  <p><span className="bold-text">Trạng thái: </span>{flight.status}</p>
                  <p><span className="bold-text">Số ghế: </span>{flight.airplane.seat_count}</p>
                </div>
  
                <Link to={`/flights/${flight.flight_code}`}>
                  <Button color="info" className="details-button">Chi tiết</Button>
                </Link>
              </div>
            );
          })
        ) : (
          <p className="no-flights">Không tìm thấy chuyến bay nào.</p>
        )}
      </div>
    </div>
  );
        }
export default Flight;
