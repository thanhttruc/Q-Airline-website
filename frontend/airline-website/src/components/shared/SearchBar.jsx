import React, { useState, useEffect } from 'react';
import { Input, Button } from 'reactstrap';

const FlightSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  useEffect(() => {
    fetch('/api/flights')
      .then((response) => response.json())
      .then((data) => {
        const flightsArray = Object.values(data); // Convert object to array
        setFlights(flightsArray);
        setFilteredFlights(flightsArray); // Initialize filteredFlights
      })
      .catch((err) => console.error('Error fetching flights:', err));
  }, []);

  const handleSearch = () => {
    const results = flights.filter((flight) =>
      flight.flight_code.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredFlights(results);
  };

  return (
    <div>
      <div className="search-bar">
        <Input
          type="text"
          placeholder="Tìm chuyến bay..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button color="primary" className="ml-2" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
      <div className="flight-results">
        {filteredFlights && filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <div key={flight.id}>
              <p>Flight Code: {flight.flight_code}</p>
              <p>Airline: {flight.airline}</p>
              <p>Departure: {flight.departure_time}</p>
              <p>Arrival: {flight.arrival_time}</p>
            </div>
          ))
        ) : (
          <p>No flights found.</p>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
